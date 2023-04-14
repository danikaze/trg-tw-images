import { ApiGame } from '../api/response-types';
import { GameBasicInfo, GameBasicInfoPlatform } from '../db/types';
import { getDateDetails } from './date';
import { logger } from './logger';
import { getPlatformType } from './platform';

const REGEX_DATE = /(?<year>\d{4})(-(?<month>\d{1,2})(-(?<day>\d{1,2}))?)?/;

/**
 * From the information returned by the /games API, return the
 * information needed to be stored in the basic database to be able
 * to choose the game to tweet based on the criteria
 */
export function apiGame2gameBasicInfo(game: ApiGame): GameBasicInfo {
  const platforms: GameBasicInfoPlatform[] = game.platforms.reduce(
    (acc, platform) => {
      const platformType = getPlatformType(platform.platform_id);
      if (!platformType) {
        logger.warn(
          `Unknown platform type for platform_id "${platform.platform_id}"`
        );
        return acc;
      }

      const date = getDateDetails(platform.first_release_date);
      if (!date) {
        logger.warn(
          `Can't parse release date (${platform.first_release_date}) ` +
            `for game:platform ${game.game_id}:${platform.platform_id}`
        );
        return acc;
      }

      acc.push({ type: platformType, ...date });
      return acc;
    },
    [] as GameBasicInfoPlatform[]
  );

  return {
    title: game.title,
    id: game.game_id,
    platforms,
  };
}
