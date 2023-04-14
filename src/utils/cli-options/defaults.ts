import { PlatformType } from 'src/game-source/types';

/**
 * No game before this year will be chosen
 */
export const DEFAULT_GAME_YEAR_MIN = 1970;
/**
 * No game after this year will be chosen
 */
export const DEFAULT_GAME_YEAR_MAX = 1998;

/**
 * Choose games from the following platforms only
 */
export const DEFAULT_PLATFORMS = (() => {
  const list: PlatformType[] = [
    'c64',
    'msx',
    'zx-spectrum',
    'amiga',
    'dos',
    'gameboy',
    'gameboy-color',
    'gameboy-advance',
    'game-gear',
    'nes',
    'pc88',
    'sega-cd',
    'sega-master-system',
    'sega-saturn',
    'snes',
    'Neo Geo',
    'turbo-grafx',
    'turbografx-cd',
  ];
  return list.join(',');
})();
