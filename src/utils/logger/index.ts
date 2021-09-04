import { getCliOptions } from '@utils/cli-options';
import { Logger } from './logger';

export type LoggerLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug';

/**
 * Global logger instance can be customized by editing `/logger.config.js`
 */
export interface LoggerOptions {
  /**
   * Maximum severity level to log
   *
   * Default: `error` in production, `debug` in develop mode
   */
  level?: LoggerLevel;
  /**
   * If `true`, nothing will be logged
   *
   * Default: `false`
   */
  silent?: boolean;
  /**
   * Enables logging to the console
   *
   * Default: `false` in production or tests, `true` in develop mode
   */
  console?: boolean;
  /**
   * Disable colors in the logs
   *
   * Usually is always better to have colors in client side.
   * For server side, it's better enabled if logs are checked using
   * console commands that support colors, such as `tail`, `cat` or `grep`
   * but better to disable them if looking to the raw files directly
   *
   * Default: `false`
   */
  disableColors?: boolean;
  /**
   * If `false`, the timestamp won't be added in the log messages
   *
   * Default: `true`
   */
  addTimestamp?: boolean;
  /**
   * Folder where to write the logs files (server side only)
   * It is required if `outputFile` is defined
   *
   * Default: `logs`
   */
  outputFolder?: string;
  /**
   * If specified, enables logging to a file (server side only)
   * Relative to `outputFolder`
   *
   * Default: `%DATE%.log`
   */
  outputFile?: string;
  /**
   * Maximum number of logs to keep
   * Set to `undefined` to disable the limit
   *
   * Default: `30`
   */
  maxFiles?: number;
}

export type LogFunction = (...messages: unknown[]) => void;

/**
 * Namespaced logger object, returned by `useLogger`
 *
 * It contains all the functions to log a message based on its severity
 */
export interface NsLogger {
  /**
   * Logs errors affecting the operation/service
   */
  error: LogFunction;
  /**
   * Logs recuperable errors involving unexpected things
   */
  warn: LogFunction;
  /**
   * Log processes taking place (start, stop, etc.).
   * Useful to follow the app workflow
   */
  info: LogFunction;
  /**
   * Log detailed info, not important messages
   */
  verbose: LogFunction;
  /**
   * Log debug messages
   */
  debug: LogFunction;
}

export const getLogger = (() => {
  const cliOptions = getCliOptions();
  const logger = new Logger({
    level: cliOptions.logLevel,
    console: cliOptions.logConsole,
    silent: cliOptions.logSilent,
  });
  return logger.getLogger.bind(logger);
})();
