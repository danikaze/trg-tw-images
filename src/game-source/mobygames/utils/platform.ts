import { PlatformType } from 'src/game-source/types';
import { ApiPlatform } from '../api/other-types';
import { PLATFORMS } from '../constants/platform';

/**
 * Get the _standard_ `PlatformType` from MobyGames platform data
 */
export function getPlatformType(
  platformId: ApiPlatform['platform_id']
): PlatformType | undefined {
  const platform = Object.entries(PLATFORMS).find(
    ([type, { id }]) => id === platformId
  );
  return platform?.[0] as PlatformType;
}

/**
 * Get the MobyGames platform ID from the _standard_ `PlatformType`
 */
export function getPlatformId(
  platformType: PlatformType
): ApiPlatform['platform_id'] | undefined {
  return PLATFORMS[platformType]?.id;
}
