import { PLATFORM_NAMES } from './constants';

export type Platform = keyof typeof PLATFORM_NAMES;

export class MobyGames {
  public static getPlatformGamesListPerYear(platform: Platform): string {
    return `https://www.mobygames.com/browse/games/${platform}/offset,0/so,1d/list-games/`;
  }

  public getPlatforms(): Platform[] {
    return Object.keys(PLATFORM_NAMES) as Platform[];
  }
}
