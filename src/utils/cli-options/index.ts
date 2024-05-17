import { AppOptions } from 'src/apps/tweet-game';
import { PLATFORM_NAMES } from 'src/game-source/constants/platform';
import {
  GameSourceType,
  GAME_SOURCE_TYPES,
  PlatformType,
} from 'src/game-source/types';
import { LoggerLevel, LoggerOptions } from '../logger';
import {
  DEFAULT_GAME_YEAR_MAX,
  DEFAULT_GAME_YEAR_MIN,
  DEFAULT_PLATFORMS,
} from './defaults';
import { getString, getFlag, getBool, getNumber } from './helpers';

export type CliOptions = AppOptions & {
  logSilent: boolean;
  logConsole: boolean;
  logFile: boolean;
  logLevel: LoggerOptions['level'];
  /** When true, it will ask for user and password interactively */
  interactiveUser?: boolean;
};

let cachedOptions: CliOptions | undefined;

export function getCliOptions(): CliOptions {
  if (cachedOptions) return cachedOptions;

  try {
    cachedOptions = getOptions();
    return cachedOptions;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(String(error as Error));
    process.exit(1);
  }
}

function getOptions(): CliOptions {
  const logLevel = getString('log.level', 'info') as LoggerLevel;
  if (!['error', 'warn', 'info', 'verbose', 'debug'].includes(logLevel)) {
    throw new Error(`Wrong log.level "${logLevel}"`);
  }

  const platforms = getString('platforms', DEFAULT_PLATFORMS)
    .split(',')
    .map((str) => str.trim())
    .filter(Boolean) as PlatformType[];

  platforms.forEach((platform) => {
    if (!Object.keys(PLATFORM_NAMES).includes(platform)) {
      throw new Error(`Wrong platform "${platforms}`);
    }
  });

  const gameSource = getString('gamesource', 'mobygames') as GameSourceType;
  if (!GAME_SOURCE_TYPES.includes(gameSource)) {
    throw new Error(`Wrong gameSource "${gameSource}"`);
  }

  return {
    gameSource,
    ui: getFlag('ui', false),
    interactiveUser: getFlag('u', false),
    dry: getFlag('dry', false),
    gameId: getString('gameId', ''),
    platforms: platforms?.length ? platforms : undefined,
    minYear: getNumber('year', getNumber('minYear', DEFAULT_GAME_YEAR_MIN)),
    maxYear: getNumber('year', getNumber('maxYear', DEFAULT_GAME_YEAR_MAX)),
    skipCleaning: getFlag('skipCleaning', false),
    logSilent: getFlag('log.silent', false),
    logConsole: getBool('log.console', true),
    logFile: getBool('log.file', true),
    logLevel,
  };
}
