import { unlinkSync } from 'fs';
import {
  IMAGES_COVER_ART,
  DELETE_IMAGES,
  IMAGES_MAX,
  OTHER_PLATFORMS_MAX,
  OTHER_PLATFORMS_MIN,
  TWEET_MAX_LENGTH,
} from '@utils/constants';
import { getLogger } from '@utils/logger';
import { selectRandom } from '@utils/random';
import { MobyGames } from 'src/mobygames';
import { Game, GameFullInfo } from 'src/mobygames/game';
import { Image, ImageInfo, imageInfoSorter } from 'src/mobygames/image';
import { PlatformGames } from 'src/mobygames/platform';
import { tweetImage } from 'src/twitter';

interface AppOptions {
  dry: boolean;
  gameUrl?: string;
}

const logger = getLogger('App');

export class App {
  protected readonly dry: boolean;
  protected readonly gameUrl?: string;

  constructor(options: AppOptions) {
    this.dry = options.dry;
    this.gameUrl = options.gameUrl;
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

    paths.push(
      ...selectRandom(
        coverArtImagePageUrls,
        Math.min(IMAGES_COVER_ART, IMAGES_MAX)
      )
    );

    paths.push(
      ...selectRandom(screenshotsImagePageUrls, IMAGES_MAX - paths.length)
    );

    return paths;
  }

  protected static getTweetText(game: GameFullInfo): string {
    const line1 = `【${game.name}】`;
    const line2 =
      !game.year && !game.platform
        ? ''
        : game.year && game.platform
        ? `${PlatformGames.getName(game.platform)} (${game.year})`
        : String(game.year) || PlatformGames.getName(game.platform!);

    const main = [line1, line2 ? ` ※ ${line2}` : '', '\n']
      .map((line) => line.trim())
      .filter((line) => !!line)
      .join('\n');

    if (!game.otherPlatforms) return main;

    /**
     * 2 for ellipsis
     * 1 extra for each 【】 in the title
     * 1 extra for each ※
     */
    const TEXT_EXTRA_LENGTH = 6;
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
    const platform = new PlatformGames(mg.getRandomPlatform());

    const gameUrl = this.gameUrl || (await platform.getRandomGameUrl());
    if (!gameUrl) return;
    const game = new Game(gameUrl);
    const gameInfo = await game.getInfo();

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

    try {
      tweetImage(text, images);
      return true;
    } catch (e) {
      return false;
    }
  }
}
