import { Platform } from 'src/interfaces';
import { PLATFORM_NAMES } from 'src/mobygames/constants';
import { LoggerLevel } from '../logger';
import { getString, getFlag, getBool, getNumber } from './helpers';

export function getCliOptions() {
  try {
    return getOptions();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(String(error as Error));
    process.exit(1);
  }
}

function getOptions() {
  const logLevel = getString('log.level', 'info') as LoggerLevel;
  if (!['error', 'warn', 'info', 'verbose', 'debug'].includes(logLevel)) {
    throw new Error(`Wrong log.level "${logLevel}"`);
  }

  const platform = getString('platform', '') as Platform;
  if (!Object.keys(PLATFORM_NAMES).includes(platform)) {
    throw new Error(`Wrong platform "${platform}`);
  }

  return {
    dry: getFlag('dry', false),
    gameUrl: getString('game', ''),
    platform,
    year: getNumber('year', 0),
    reset: getFlag('reset', false),
    logSilent: getFlag('log.silent', false),
    logConsole: getBool('log.console', true),
    logFile: getBool('log.file', true),
    logLevel,
  };
}
