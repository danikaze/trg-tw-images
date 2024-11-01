/**
 * Minimum number of Front Covers that a game must have to be eligible
 */
export const IMAGES_FRONT_COVER_MIN = 1;
/**
 * Minimum number of images in total to include in a tweet
 * for a game to be eligible (covers + screenshots)
 */
export const IMAGES_MIN = 3;
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
 */
export const OTHER_PLATFORMS_MIN = 1;
/**
 * Maximum number of platforms to fit in the tweet (0 = no limit)
 * (limited by `TWEET_MAX_LENGTH` anyways)
 */
export const OTHER_PLATFORMS_MAX = 0;

/**
 * When selecting game information, it will try to select elements based on
 * this setting when available, using images ordered by this languages/countries
 */
export const GAME_PREFERRED_LANGS = [
  'Spain',
  'Worldwide',
  'Japan',
  'United States',
  'United Kingdom',
];
