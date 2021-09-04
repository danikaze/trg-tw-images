import { COVER_ART_IMAGES, MAX_IMAGES } from '@utils/constants';
import { downloadImage } from '@utils/download';
import { getTempFilePath } from '@utils/get-temp-file-path';
import { selectRandom } from '@utils/random';
import { MobyGames } from 'src/mobygames';
import { MobyGamesGame } from 'src/mobygames/game';
import { MobyGamesPlatform } from 'src/mobygames/platform';
import { tweetImage } from 'src/twitter';

interface AppOptions {
  dry: boolean;
}

export class App {
  protected readonly imageUrlList: string[] = [];
  protected readonly dry: boolean;

  constructor(options: AppOptions) {
    this.dry = options.dry;
  }

  /**
   * Download N images from the given url list (in order)
   *
   * @returns list to the path of the downloaded files
   */
  protected static async downloadImages(
    urlList: string[],
    n: number
  ): Promise<string[]> {
    const paths: string[] = [];
    let i = 0;

    while (paths.length < n && i < urlList.length) {
      const tempFile = getTempFilePath(urlList[i]);
      try {
        await downloadImage(urlList[i], tempFile);
        paths.push(tempFile);
      } catch (e) {}
      i++;
    }

    return paths;
  }

  /**
   * Automatically queue a tweet with images about a random game
   */
  public async run(): Promise<void> {
    const mg = new MobyGames();
    const platformList = mg.getPlatforms();

    const platform = new MobyGamesPlatform(selectRandom(platformList)!);

    const gameUrl = await platform.getRandomGameUrl();
    const game = new MobyGamesGame(gameUrl);
    await game.load();

    const coverArtList = game.getCoverArtList();
    const screenshotList = game.getScreenshotList();

    this.imageUrlList.push(
      ...(await App.downloadImages(coverArtList, COVER_ART_IMAGES))
    );
    this.imageUrlList.push(
      ...(await App.downloadImages(
        screenshotList,
        MAX_IMAGES - this.imageUrlList.length
      ))
    );

    await this.tweet();
  }

  /**
   * Send the tweet with the available information
   *
   * @returns `true` if the tweet was sent
   */
  protected async tweet(): Promise<boolean> {
    if (this.dry) return false;
    if (this.imageUrlList.length === 0) return false;

    const text = '';
    try {
      tweetImage(text, this.imageUrlList);
      return true;
    } catch (e) {
      return false;
    }
  }
}
