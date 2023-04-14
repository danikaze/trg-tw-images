import { PlatformType } from 'src/game-source/types';

export interface PlatformsDb {
  totalPlatforms: number;
  platforms: {
    // normalized type
    type: PlatformType;
    // internal id in mobygames
    id: number;
  }[];
}

export interface GamesDb {
  totalGames: number;
  games: GameBasicInfo[];
}

/**
 * Information to store localy to be able to choose games
 * to tweet based on the criteria
 */
export interface GameBasicInfo {
  title: string;
  id: number;
  platforms: GameBasicInfoPlatform[];
}

export interface GameBasicInfoPlatform {
  type: PlatformType;
  // release date
  year?: number;
  month?: number;
  day?: number;
}
