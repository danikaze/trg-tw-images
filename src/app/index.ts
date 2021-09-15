import { unlinkSync } from 'fs';
import {
  IMAGES_COVER_ART,
  DELETE_IMAGES,
  IMAGES_MAX,
  OTHER_PLATFORMS_MAX,
  OTHER_PLATFORMS_MIN,
  TWEET_MAX_LENGTH,
  GAME_PREFERRED_LANGS,
} from '@utils/constants';
import { getLogger } from '@utils/logger';
import { selectRandom } from '@utils/random';
import { MobyGames } from 'src/mobygames';
import { Game } from 'src/mobygames/game';
import { Image, imageInfoSorter } from 'src/mobygames/image';
import { PlatformGames } from 'src/mobygames/platform';
import { Twitter } from 'src/twitter';
import { AppOptions, GameFullInfo, ImageInfo, Platform } from 'src/interfaces';

const logger = getLogger('App');

export class App {
  protected readonly dry: boolean;
  protected readonly gameUrl?: string;
  protected readonly platform?: Platform;
  protected readonly year?: number;

  constructor(options: AppOptions) {
    this.dry = options.dry;
    this.gameUrl = options.gameUrl;
    this.platform = options.platform;
    this.year = options.year;
  }

  /**
   * Download N images from the given url list (in order)
   *
   * @returns list to the path of the downloaded files
   */
  protected static async downloadImages(
    imagePageList: string[]
  ): Promise<ImageInfo[]> {
    const list = await Promise.all(
      imagePageList.map(async (url) => {
        try {
          const imagePage = new Image(url);
          return await imagePage.downloadImage();
        } catch (e) {}
      })
    );
    return list.filter((info) => !!info) as ImageInfo[];
  }

  protected static chooseImages(game: GameFullInfo): string[] {
    const paths: string[] = [];
    const { coverArtImagePageUrls, screenshotsImagePageUrls } = game;

    // Front Cover Images
    // Because of `qualifies` we know there are front cover images
    const frontCover = coverArtImagePageUrls!.filter(
      (cover) => cover.coverArtType === 'front-cover'
    );
    let selected = frontCover;

    // Try to get the correct language, if possible
    if (GAME_PREFERRED_LANGS.length) {
      const langImages = selected.filter((cover) =>
        GAME_PREFERRED_LANGS.map((lang) => lang.toLowerCase()).some((lang) =>
          cover.countries?.includes(lang)
        )
      );
      if (langImages.length) {
        selected = langImages;
      }
    }

    paths.push(
      ...selectRandom(selected, Math.min(IMAGES_COVER_ART, IMAGES_MAX)).map(
        (info) => info.url
      )
    );

    // Other screenshots
    paths.push(
      ...selectRandom(screenshotsImagePageUrls, IMAGES_MAX - paths.length).map(
        (info) => info.url
      )
    );

    return paths;
  }

  protected static qualifies(game: GameFullInfo): boolean {
    const { coverArtImagePageUrls, screenshotsImagePageUrls } = game;

    // a game without front-cover doesn't qualify
    const frontCoversNum = coverArtImagePageUrls
      ? coverArtImagePageUrls.filter(
          (cover) => cover.coverArtType === 'front-cover'
        ).length
      : 0;

    if (frontCoversNum < IMAGES_COVER_ART) {
      logger.info(`Game doesn't qualifies: No front-cover found`);
      return false;
    }

    // a game without enough images doesn't qualify either
    if (
      !screenshotsImagePageUrls ||
      screenshotsImagePageUrls.length < IMAGES_MAX - IMAGES_COVER_ART
    ) {
      logger.info(`Game doesn't qualifies: Not enough images`);
      return false;
    }

    return true;
  }

  protected static getTweetText(game: GameFullInfo): string {
    const line1 = `【${game.name}】`;
    const line2 = (() => {
      const line =
        !game.year && !game.platform
          ? ''
          : game.year && game.platform
          ? `${PlatformGames.getName(game.platform)} (${game.year})`
          : (game.year && String(game.year)) ||
            PlatformGames.getName(game.platform!);

      return line ? ` ※ ${line}` : '';
    })();

    const main = [line1, '\n', line2].filter((line) => !!line).join('\n');

    if (!game.otherPlatforms) return main;

    /**
     * 1 for the new line
     * 2 for ellipsis
     * 1 extra for each 【】 in the title
     * 1 extra for each ※
     */
    const TEXT_EXTRA_LENGTH = 7;
    const otherPlatformsText = '\n ※ Otras plataformas: ';
    const otherPlatforms: string[] = [];

    let availableCharacters =
      TWEET_MAX_LENGTH -
      main.length -
      otherPlatformsText.length -
      TEXT_EXTRA_LENGTH;

    for (const platform of game.otherPlatforms) {
      const platformName = PlatformGames.getName(platform);
      if (availableCharacters > platformName.length) {
        otherPlatforms.push(platformName);
        availableCharacters -= platformName.length + 2;
        if (
          OTHER_PLATFORMS_MAX > 0 &&
          otherPlatforms.length >= OTHER_PLATFORMS_MAX
        ) {
          break;
        }
      }
    }

    if (otherPlatforms.length < OTHER_PLATFORMS_MIN) return main;

    return (
      main +
      otherPlatformsText +
      otherPlatforms.join(', ') +
      (otherPlatforms.length < game.otherPlatforms.length ? '…' : '')
    );
  }

  protected static async clean(images: ImageInfo[]): Promise<void> {
    if (!DELETE_IMAGES) return;

    for (const image of images) {
      try {
        logger.info(`Removing ${image.filePath}`);
        unlinkSync(image.filePath);
      } catch (error) {
        logger.error(error);
      }
    }
  }

  /**
   * Automatically queue a tweet with images about a random game
   */
  public async run(): Promise<void> {
    const mg = new MobyGames();
    let gameInfo: GameFullInfo;

    do {
      const platform = new PlatformGames(
        this.platform || mg.getRandomPlatform()
      );

      const gameUrl = this.gameUrl || (await platform.getRandomGameUrl());
      if (!gameUrl) return;
      const game = new Game(gameUrl);
      gameInfo = await game.getInfo();
    } while (!App.qualifies(gameInfo));

    const imageUrls = App.chooseImages(gameInfo);
    const images = await App.downloadImages(imageUrls);
    images.sort(imageInfoSorter);

    await this.tweet(gameInfo, images);

    await App.clean(images);
  }

  /**
   * Send the tweet with the available information
   *
   * @returns `true` if the tweet was sent
   */
  protected async tweet(
    game: GameFullInfo,
    images: ImageInfo[]
  ): Promise<boolean> {
    const text = App.getTweetText(game);

    logger.info(
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

    if (this.dry) return false;
    if (images.length === 0) return false;

    try {
      const twitter = new Twitter(TWITTER_ACCOUNT_NAME);
      await twitter.tweetImages(text, images);
      return true;
    } catch (e) {
      return false;
    }
  }
}
