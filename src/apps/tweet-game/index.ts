import { unlinkSync } from 'fs';

import { GAME_PREFERRED_LANGS, IMAGES_MAX } from '@utils/constants';
import { downloadImages } from '@utils/download';
import { getLogger } from '@utils/logger';
import { selectRandom } from '@utils/random';
import { getGameSource } from 'src/game-source';
import { GameSource, GetRandomGameOptions } from 'src/game-source/base';
import {
  CoverArtType,
  CoverInfo,
  Game,
  GameSourceType,
  PlatformType,
} from 'src/game-source/types';
import {
  TweetImageInfo,
  TweetService,
  TweetServiceType,
} from 'src/tweet-services';
import { getTweetService } from 'src/tweet-services/get';
import { TweetTracker } from 'src/tweet-tracker';
import { gameQualifies } from './utils/game-qualifies';
import { getTweetText } from './utils/get-tweet-text';

export interface AppOptions {
  services: TweetService[];
  gameSource?: GameSourceType;
  gameId?: number | string;
  skipCleaning?: boolean;
  /** When true, it will not send the tweet */
  dry?: boolean;
  platforms?: PlatformType[];
  minYear?: number;
  maxYear?: number;
}

const logger = getLogger('App');
const MAX_TRIES = 10;

export class App {
  // eslint-disable-next-line no-magic-numbers

  protected readonly gameSource: GameSource;
  protected readonly tweetTracker: Partial<
    Record<TweetServiceType, TweetTracker>
  >;

  protected readonly options: AppOptions;

  constructor(options: AppOptions) {
    this.gameSource = getGameSource(options.gameSource || 'mobygames');
    this.tweetTracker = options.services.reduce((trackers, service) => {
      trackers[service.serviceName] = new TweetTracker({
        service: service.serviceName,
      });
      return trackers;
    }, {} as typeof App.prototype.tweetTracker);

    this.options = options;
  }

  /**
   * Automatically queue a tweet with images about a random game
   */
  public async run(): Promise<void> {
    // we don't want to keep getting the same information over and over again
    // if there's a pre-specified expected result
    const maxTries =
      this.options.gameId && this.options.platforms?.length === 1
        ? 1
        : MAX_TRIES;
    let tries = 0;
    let game: Game | undefined;

    do {
      tries++;
      game = await this.getGame();
    } while (tries < maxTries && !this.isGameUsable(game));

    if (!this.isGameUsable(game)) {
      logger.warn(`Couldn't find a game after ${tries} tries`);
      return;
    }

    logger.info(
      `Selected game (${this.gameSource.name}:${game.id}) "${game.title}"`
    );

    const images = await this.getImages(game);
    const tweetUrls = await this.tweet(game, images);

    if (tweetUrls) {
      Object.entries(tweetUrls || {}).forEach(([service, tweetUrl]) => {
        if (!tweetUrl) return;
        this.tweetTracker[service as TweetServiceType]?.addGame(
          game!,
          tweetUrl
        );
      });
    }

    await this.clean(images);
  }

  protected isGameUsable(game: Game | undefined): game is Game {
    return (
      gameQualifies(game) &&
      this.options.services.some(
        (service) => !this.tweetTracker[service.serviceName]!.gameExists(game)
      )
    );
  }

  protected async getGame(): Promise<Game | undefined> {
    if (this.options.gameId) {
      return this.gameSource.getGame(
        this.options.gameId,
        this.options.platforms
      );
    }

    const options: GetRandomGameOptions = {
      platforms: this.options.platforms,
      minYear: this.options.minYear,
      maxYear: this.options.maxYear,
    };

    return this.gameSource.getRandomGame(options);
  }

  /**
   * Select which images to use from a game
   */
  protected async getImages(game: Game): Promise<TweetImageInfo[]> {
    const urls: string[] = [];

    // Try to get one cover of the desired language
    // 1. sort the covers by language
    // 2. use the first `front-cover` found
    const coverGroups = [...game.covers];
    coverGroups.sort((a, b) => {
      const ai = Math.min(
        ...a.countries
          .map((country) => GAME_PREFERRED_LANGS.indexOf(country))
          .map((i) => (i === -1 ? Infinity : i))
      );
      const bi = Math.min(
        ...b.countries
          .map((country) => GAME_PREFERRED_LANGS.indexOf(country))
          .map((i) => (i === -1 ? Infinity : i))
      );
      return ai - bi;
    });
    const frontCover = coverGroups
      .reduce((acc, group) => [...acc, ...group.covers], [] as CoverInfo[])
      .find((cover) => cover.scanOf === CoverArtType.FRONT_COVER);

    if (frontCover) {
      urls.push(frontCover.url);
    }

    // Other screenshots
    const screenshots = selectRandom(
      game.screenshots,
      IMAGES_MAX - urls.length
    ).map((screenshot) => screenshot.url);
    urls.push(...screenshots);

    const filePaths = await downloadImages(urls);
    return filePaths.map((filePath) => ({ filePath }));
  }

  /**
   * Send the tweet with the available information to every service loaded
   *
   * @returns `true` if the tweet was sent
   */
  protected async tweet(
    game: Game,
    images: TweetImageInfo[]
  ): Promise<Partial<Record<TweetServiceType, string>> | undefined> {
    const { services } = this.options;

    logger.debug(
      `Tweet [${services.map((s) => s.serviceName).join(', ')}]`,
      JSON.stringify(
        {
          gameId: game.id,
          game: game.title,
          images: images.map((img) => img.filePath),
        },
        null,
        2
      )
    );

    if (images.length === 0) {
      logger.error(`No images to tweet`);
      return;
    }

    const res: Partial<Record<TweetServiceType, string>> = {};
    await Promise.all(
      services.map(async (service) => {
        try {
          const text = getTweetText(
            this.options.lang,
            game,
            service.textMaxChars
          );

          logger.debug(
            [
              `Text for ${service.serviceName} `,
              `(${text.length}/${service.textMaxChars} chars):\n`,
              text,
            ].join('')
          );

          if (this.options.dry) {
            logger.debug(
              `Skipping posting on ${service.serviceName} due to --dry`
            );
            return;
          }

          const url = await service.tweetImages(text, images);

          if (!url) {
            logger.error(`No url when tweeting to ${service.serviceName}`);
          }

          res[service.serviceName] = url;
        } catch (e) {
          logger.error(String(e));
        }
      })
    );
    return res;
  }

  /**
   * Remove images from the temporal folder
   */
  protected async clean(images: TweetImageInfo[]): Promise<void> {
    if (this.options.skipCleaning) {
      logger.debug(`Skipping cleaning...`);
      return;
    }

    let ok = 0;
    for (const image of images) {
      try {
        logger.debug(`Removing "${image.filePath}"`);
        unlinkSync(image.filePath);
        ok++;
      } catch (error) {
        logger.error(error);
      }
    }

    logger.info(`Last tweet's images removed (${ok}/${images.length})`);
  }
}
