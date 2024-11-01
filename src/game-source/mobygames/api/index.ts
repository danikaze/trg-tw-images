import {
  ApiGame,
  ApiGamePlatformsCovers,
  ApiGamePlatformsScreenshots,
  ApiGames,
  ApiPlatforms,
} from './response-types';
import { PlatformType } from 'src/game-source/types';
import { getPlatformId } from '../utils/platform';
import { callApi, getApiMeta } from '../utils/api';
import {
  ApiGamePlatformCoverGroup,
  ApiPlatform,
  ApiScreenshot,
} from './other-types';

// https://www.mobygames.com/info/api/#limits
export const MAX_CALLS_PER_HOUR = 360;
export const MIN_MS_BETWEEN_CALLS = 1000;
const DEFAULT_NEW_GAMES_QTY = 100;

export function getCalledTimes(): number {
  return getApiMeta().totalCalls;
}

export async function fetchPlatforms(): Promise<ApiPlatform[]> {
  const res = await callApi<ApiPlatforms>('platforms');
  return res.platforms;
}

export async function fetchNewGames(
  offset: number,
  qty = DEFAULT_NEW_GAMES_QTY
): Promise<ApiGame[]> {
  const res = await callApi<ApiGames>(
    `games?format=normal&offset=${offset}&limit=${qty}`
  );
  return res.games;
}

export async function fetchGameDetails(gameId: number): Promise<ApiGame> {
  return await callApi<ApiGame>(`games/${gameId}`);
}

export async function fetchGameCoverGroups(
  gameId: number,
  platformType: PlatformType
): Promise<ApiGamePlatformCoverGroup[]> {
  const platformId = getPlatformId(platformType);
  const res = await callApi<ApiGamePlatformsCovers>(
    `games/${gameId}/platforms/${platformId}/covers`
  );
  return res.cover_groups;
}

export async function fetchGameScreenshots(
  gameId: number,
  platformType: PlatformType
): Promise<ApiScreenshot[]> {
  const platformId = getPlatformId(platformType);
  const res = await callApi<ApiGamePlatformsScreenshots>(
    `games/${gameId}/platforms/${platformId}/screenshots`
  );
  return res.screenshots;
}
