import { LoggerLevel } from '../logger';
import { getString, getFlag, getBool } from './helpers';

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

  return {
    dry: getFlag('dry', false),
    reset: getFlag('reset', false),
    logSilent: getFlag('log.silent', false),
    logConsole: getBool('log.console', true),
    logFile: getBool('log.file', true),
    logLevel,
  };
}
