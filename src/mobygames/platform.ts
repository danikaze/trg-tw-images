import { default as cheerio, CheerioAPI } from 'cheerio';
import { downloadHtml } from '@utils/download';
import { PLATFORM_NAMES } from './constants';
import { Platform } from '.';
import { selectRandom } from '@utils/random';
import { GAME_YEAR_MAX, GAME_YEAR_MIN } from '@utils/constants';
import { getLogger } from '@utils/logger';
import { getHref, getInnerText } from '@utils/parser';

interface GameInfo {
  url: string;
  name: string;
  year: number;
}

const logger = getLogger('Platform');

export class PlatformGames {
  protected readonly platform: Platform;

  constructor(platform: Platform) {
    this.platform = platform;
  }

  public static isValidPlatform(platform: string): platform is Platform {
    return Object.keys(PLATFORM_NAMES).includes(platform);
  }

  public static getName(platform: Platform): string {
    return PLATFORM_NAMES[platform];
  }

  public getName(): string {
    return PlatformGames.getName(this.platform);
  }

  public async getRandomGameUrl(): Promise<string | undefined> {
    logger.info(`Searching for a game: ${this.platform}`);
    const $ = await this.load();
    const yearsFirstPages = this.getYearsFirstPage($);
    const availableYears = Object.keys(yearsFirstPages).map(Number);
    const limitedYears = availableYears.filter(
      (year) => year >= GAME_YEAR_MIN && year <= GAME_YEAR_MAX
    );

    logger.info(
      `Available years: ${Math.min(...availableYears)}-${Math.max(
        ...availableYears
      )}`
    );

    const MAX_RETRIES = 5;
    let tries = 0;
    while (tries < MAX_RETRIES) {
      const year = selectRandom(limitedYears)!;
      logger.info(`Year: ${year}`);
      const games = await this.getYearGames(year, yearsFirstPages[year]);
      const game = selectRandom(games);
      if (game) {
        logger.info(`Game: ${game.name} (${game.url})`);
        return game.url;
      }
      logger.warn('No game found');
      tries++;
    }
    logger.warn(`Couldn't get a game in ${tries} retries`);
  }

  protected async load(): Promise<CheerioAPI> {
    const url = `https://www.mobygames.com/browse/games/${this.platform}/offset,0/so,1d/list-games/`;
    const html = await downloadHtml(url);
    return cheerio.load(html);
  }

  protected getGameList($: CheerioAPI): GameInfo[] {
    const rows = Array.from($('#mof_object_list tbody tr'));

    return rows.map((row) => {
      const aElems = Array.from($!('td a', row));
      return {
        url: getHref(aElems)!,
        name: getInnerText(aElems[0]),
        year: Number(getInnerText(aElems[1])),
      };
    });
  }

  protected getNextPageUrl($: CheerioAPI): string | undefined {
    const a = $('.mobHeaderNav a')[1];
    if (!a) return;
    return getHref(a);
  }

  protected getYearsFirstPage($: CheerioAPI): Record<number, string> {
    const pagination = $('.pagination')[0];
    const paginationLinks = Array.from($('a', pagination));

    return paginationLinks.reduce((list, a) => {
      const url = getHref(a)!;
      const text = getInnerText(a);
      const match = /(\d+)?\s*-\s(\d+)/.exec(text);

      if (match) {
        const y0 = Number(match[1]) || new Date().getFullYear();
        const y1 = Number(match[2]);
        for (let year = Math.min(y0, y1); year <= Math.max(y0, y1); year++) {
          list[year] = url;
        }
      } else {
        list[Number(text)] = url;
      }

      return list;
    }, {} as Record<number, string>);
  }

  protected async getYearGames(
    year: number,
    firstUrl: string
  ): Promise<GameInfo[]> {
    let url: string | undefined = firstUrl;
    const gameList: GameInfo[] = [];
    let moreGames = true;

    do {
      const html = await downloadHtml(url);
      const $ = cheerio.load(html);
      const pageGames = this.getGameList($);
      const yearGames = pageGames.filter((game) => game.year === year);
      gameList.push(...yearGames);

      url = this.getNextPageUrl($);
      moreGames = yearGames.length === pageGames.length;
    } while (url && moreGames);

    return gameList;
  }
}
