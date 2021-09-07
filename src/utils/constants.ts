import { join } from 'path';

export const PATH_TEMP_FOLDER = join(__dirname, 'temp');

/**
 * No game older than this will be chosen
 */
export const GAME_YEAR_MIN = 1900;
/**
 * No game younger than this will be chosen
 */
export const GAME_YEAR_MAX = 1998;

/**
 * Number of Cover Art images to include
 */
export const IMAGES_COVER_ART = 1;
/**
 * Maximum number of images to include in a tweet
 * (to be filled with screenshots)
 */
export const IMAGES_MAX = 4;

/**
 * If `true`, ALT text will be sent to twitter if available
 */
export const IMAGES_INCLUDE_ALT = false;

/**
 * Minimum number of platforms to fit in the tweet before showing the
 * "Other platforms" section (0 = no limit)
 */
export const OTHER_PLATFORMS_MIN = 0;
/**
 * Maximum number of platforms to fit in the tweet (0 = no limit)
 * (limited by `TWEET_MAX_LENGTH` anyways)
 */
export const OTHER_PLATFORMS_MAX = 0;

/**
 * Maximum number of characters of a tweet
 */
export const TWEET_MAX_LENGTH = 280;

/**
 * Delete images after tweeting them or not
 */
export const DELETE_IMAGES = false;

/**
 * When selecting game information, it will try to select elements based on
 * this setting when available
 */
export const GAME_PREFERRED_LANGS = ['Spain'];
