import { join } from 'path';
import { PlatformType } from 'src/game-source/types';

export const PATH_TEMP_FOLDER = join(__dirname, 'temp');
export const PATH_DATA_FOLDER = join(__dirname, 'data');

/**
 * No game before this year will be chosen
 */
export const GAME_YEAR_MIN = 1970;
/**
 * No game after this year will be chosen
 */
export const GAME_YEAR_MAX = 1998;

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
 * Maximum number of characters of a tweet
 */
export const TWEET_MAX_LENGTH = 280;

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

/**
 * Choose games from the following platforms only
 */
export const PLATFORMS = (() => {
  const list: PlatformType[] = [
    'amiga',
    'dos',
    'gameboy',
    'gameboy-color',
    'game-gear',
    'nes',
    'pc88',
    'sega-cd',
    'sega-master-system',
    'sega-saturn',
    'snes',
  ];
  return list.join(',');
})();
