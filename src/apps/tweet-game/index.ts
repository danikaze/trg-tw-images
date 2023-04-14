import { GAME_PREFERRED_LANGS, IMAGES_MAX } from '@utils/constants';
import { downloadImages } from '@utils/download';
import { getLogger } from '@utils/logger';
import { selectRandom } from '@utils/random';
import { unlinkSync } from 'fs';
import { getGameSource } from 'src/game-source';
import { GameSource, GetRandomGameOptions } from 'src/game-source/base';
import {
  CoverArtType,
  CoverInfo,
  Game,
  GameSourceType,
  PlatformType,
} from 'src/game-source/types';
import { TweetTracker } from 'src/tweet-tracker';
import { Twitter, TwitterImageInfo } from 'src/twitter';
import { gameQualifies } from './utils/game-qualifies';
import { getTweetText } from './utils/get-tweet-text';

export interface AppOptions {
  gameSource?: GameSourceType;
  gameId?: number | string;
  skipCleaning?: boolean;
  /** When true, it will not send the tweet */
  dry?: boolean;
  platforms?: PlatformType[];
  year?: number;
}

const logger = getLogger('App');
const MAX_TRIES = 10;

export class App {
  // eslint-disable-next-line no-magic-numbers

  protected readonly gameSource: GameSource;
  protected readonly tweetTracker: TweetTracker;

  protected readonly options: AppOptions;

  constructor(options: AppOptions) {
    this.gameSource = getGameSource(options.gameSource || 'mobygames');
    this.tweetTracker = new TweetTracker();

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
    } while (
      tries < maxTries &&
      (!gameQualifies(game) || this.tweetTracker.gameExists(game!))
    );

    if (!game) {
      logger.warn(`Couldn't find a game after ${tries} tries`);
      return;
    }

    logger.info(
      `Selected game (${this.gameSource.name}:${game.id}) "${game.title}"`
    );

    const images = await this.getImages(game);
    const tweetUrl = await this.tweet(game, images);

    if (tweetUrl) {
      this.tweetTracker.addGame(game, tweetUrl);
    }

    await this.clean(images);
  }

  protected async getGame(): Promise<Game | undefined> {
    if (this.options.gameId) {
      return this.gameSource.getGame(
        this.options.gameId,
        this.options.platforms
      );
    }

    const options: GetRandomGameOptions = {};
    if (this.options.platforms) {
      options.platforms = this.options.platforms;
    }
    if (this.options.year) {
      options.maxYear = this.options.year;
      options.minYear = this.options.year;
    }
    return this.gameSource.getRandomGame(options);
  }

  /**
   * Select which images to use from a game
   */
  protected async getImages(game: Game): Promise<TwitterImageInfo[]> {
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
   * Send the tweet with the available information
   *
   * @returns `true` if the tweet was sent
   */
  protected async tweet(
    game: Game,
    images: TwitterImageInfo[]
  ): Promise<string | undefined> {
    const text = getTweetText(game);

    logger.debug(
      'Tweet',
      JSON.stringify(
        {
          text,
          images: images.map((img) => img.filePath),
        },
        null,
        2
      )
    );

    if (this.options.dry) {
      logger.debug(`Exiting due to --dry flag`);
      return;
    }

    if (images.length === 0) {
      logger.error(`No images to tweet`);
      return;
    }

    try {
      const twitter = new Twitter(TWITTER_ACCOUNT_NAME);
      return twitter.tweetImages(text, images);
    } catch (e) {
      return;
    }
  }

  /**
   * Remove images from the temporal folder
   */
  protected async clean(images: TwitterImageInfo[]): Promise<void> {
    if (this.options.skipCleaning) {
      logger.debug(`Skipping cleaning...`);
      return;
    }

    let ok = 0;
    for (const image of images) {
      try {
        logger.debug(`Removing ${image.filePath}`);
        unlinkSync(image.filePath);
        ok++;
      } catch (error) {
        logger.error(error);
      }
    }

    logger.info(`Last tweet's images removed (${ok}/${images.length})`);
  }
}
