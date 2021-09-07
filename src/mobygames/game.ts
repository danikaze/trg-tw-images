import { default as cheerio, CheerioAPI, Element } from 'cheerio';
import { downloadHtml } from '@utils/download';
import { getHref, getInnerText } from '@utils/parser';
import { getLogger } from '@utils/logger';
import { GameFullInfo, Platform, ThumbnailInfo } from 'src/interfaces';
import { PlatformGames } from './platform';
import { ImageList } from './image-list';

const logger = getLogger('Game');

export class Game {
  protected readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  protected static getCoreGameInfo(
    $: CheerioAPI,
    filter: string | RegExp
  ): Element | undefined {
    const divs = Array.from($('#coreGameRelease div'));
    const i = divs.findIndex((elem) => {
      const text = getInnerText(elem);
      return typeof filter === 'string'
        ? text.toLowerCase().includes(filter.toLowerCase())
        : filter.test(text);
    });
    if (i === -1 || divs.length <= i) return;
    return divs[i + 1];
  }

  public async getInfo(): Promise<GameFullInfo> {
    logger.info(`Getting info from ${this.url}`);
    const $ = await this.load();

    const info: GameFullInfo = {
      url: this.url,
      name: this.getName($),
      year: this.getReleaseYear($),
      platform: this.getPlatform($),
      otherPlatforms: this.getOtherPlatforms($),
      gameCoverImagePageUrl: await this.getGameCoverPageUrl($),
      coverArtImagePageUrls: await this.getCoverArtPageList($),
      screenshotsImagePageUrls: await this.getScreenshotPageUrlList($),
    };

    logger.info(`Game info: ${JSON.stringify(info, null, 2)}`);
    return info;
  }

  protected getName($: CheerioAPI): string {
    const titleLink = $('h1.niceHeaderTitle a')[0];
    return getInnerText(titleLink);
  }

  protected getReleaseYear($: CheerioAPI): number | undefined {
    const releaseElem = Game.getCoreGameInfo($, 'Released');
    if (!releaseElem) return;
    const date = getInnerText(releaseElem);
    const match = /(19\d\d)/.exec(date);
    if (!match) return;
    return Number(match[1]);
  }

  protected getPlatform($: CheerioAPI): Platform | undefined {
    const re1 = /mobygames\.com\/game\/([^\\]+)\/[^\\]+/;
    let match = re1.exec(this.url);
    if (match) return match[1] as Platform;

    const re2 = /mobygames\.com\/browse\/games\/([^\\]+)\/$/;
    const titlePlatform = $('h1.niceHeaderTitle small a')[0];
    const url = getHref(titlePlatform);
    if (!url) return;
    match = re2.exec(url);
    if (match) return match[1] as Platform;
  }

  protected getOtherPlatforms($: CheerioAPI): Platform[] | undefined {
    const releaseElem = Game.getCoreGameInfo($, 'Also For');
    if (!releaseElem) return;

    return releaseElem.children
      .map((elem) => {
        const href = getHref(elem as Element);
        if (!href) return;
        const re = /https:\/\/www.mobygames.com\/game\/([^/]+)\//;
        const match = re.exec(href);
        if (!match) return;
        if (!PlatformGames.isValidPlatform(match[1])) return;
        return match[1];
      })
      .filter((plat) => !!plat) as Platform[];
  }

  protected async getGameCoverPageUrl(
    $: CheerioAPI
  ): Promise<string | undefined> {
    const elem = $('#coreGameCover a')[0];
    if (!elem) return;
    const imagePageUrl = getHref(elem);
    return imagePageUrl;
  }

  protected async getCoverArtPageList(
    $: CheerioAPI
  ): Promise<ThumbnailInfo[] | undefined> {
    const coverArtUrl = `${this.url}/cover-art`;
    const imageList = new ImageList(coverArtUrl);
    return imageList.getImagePageUrls();
  }

  protected async getScreenshotPageUrlList(
    $: CheerioAPI
  ): Promise<ThumbnailInfo[] | undefined> {
    const screenshotsUrl = `${this.url}/screenshots`;
    const imageList = new ImageList(screenshotsUrl);
    return imageList.getImagePageUrls();
  }

  protected async load(): Promise<CheerioAPI> {
    const html = await downloadHtml(this.url);
    return cheerio.load(html);
  }
}
