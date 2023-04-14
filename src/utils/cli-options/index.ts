import { PLATFORMS } from '@utils/constants';
import { AppOptions } from 'src/apps/tweet-game';
import { PLATFORM_NAMES } from 'src/game-source/constants/platform';
import { PlatformType } from 'src/game-source/types';
import { LoggerLevel, LoggerOptions } from '../logger';
import { getString, getFlag, getBool, getNumber } from './helpers';

export type CliOptions = AppOptions & {
  reset: boolean;
  logSilent: boolean;
  logConsole: boolean;
  logFile: boolean;
  logLevel: LoggerOptions['level'];
};

export function getCliOptions() {
  try {
    return getOptions();
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

  return {
    dry: getFlag('dry', false),
    gameId: getString('gameId', ''),
    platforms: platforms?.length ? platforms : undefined,
    year: getNumber('year', 0),
    reset: getFlag('reset', false),
    skipCleaning: getFlag('skipCleaning', false),
    logSilent: getFlag('log.silent', false),
    logConsole: getBool('log.console', true),
    logFile: getBool('log.file', true),
    logLevel,
  };
}
