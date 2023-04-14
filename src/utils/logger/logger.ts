import { createLogger, transports, format, Logger as Winston } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { join } from 'path';
import { grey } from 'chalk';
import { LoggerLevel, LoggerOptions, NsLogger } from '.';

interface MessageData extends TransformableInfo {
  level: LoggerLevel;
  timestamp: string;
  namespace: string;
}

// interface from `logform` package, used by winston
interface TransformableInfo {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  level: string;
  message: string;
}

// interface from `logform` package, used by winston
interface Format {
  transform: (data: TransformableInfo) => TransformableInfo | boolean;
}

const bypass = (x: unknown) => x;

export class Logger {
  private readonly nsLoggers: { [namespace: string]: NsLogger } = {};
  private readonly winston: Winston;
  private readonly formatNamespace: (text: string) => string;

  constructor(options?: LoggerOptions) {
    const opt: Required<LoggerOptions> = {
      level: IS_PRODUCTION ? 'error' : 'debug',
      silent: false,
      console: !IS_PRODUCTION,
      disableColors: false,
      addTimestamp: true,
      outputFolder: process.env.PATH_LOGS_FOLDER || 'logs',
      outputFile: '%DATE%.log',
      maxFiles: 30,
      ...options,
    };

    this.formatNamespace = (opt.disableColors ? bypass : grey) as (
      text: string
    ) => string;

    this.winston = createLogger({
      silent: opt.silent,
      level: opt.level,
      transports: Logger.getTransports(opt),
      format: this.getFormats(opt),
    });
  }

  private static getTransports(options: Required<LoggerOptions>) {
    const winstonTransports = [];

    if (options.console) {
      winstonTransports.push(new transports.Console());
    }

    if (options.outputFile) {
      winstonTransports.push(
        new DailyRotateFile({
          dirname: options.outputFolder,
          filename: options.outputFile,
          maxFiles: options.maxFiles,
          auditFile: join(
            options.outputFolder,
            'audit',
            `.audit-${new Date().toISOString()}`
          ),
        })
      );
    }

    return winstonTransports;
  }

  public getLogger(namespace?: string): NsLogger {
    const ns = namespace || '';
    let nsl = this.nsLoggers[ns];
    if (nsl) {
      return nsl;
    }

    const log = this.log;
    nsl = {
      error: log.bind(this, 'error', ns),
      warn: log.bind(this, 'warn', ns),
      info: log.bind(this, 'info', ns),
      verbose: log.bind(this, 'verbose', ns),
      debug: log.bind(this, 'debug', ns),
    };
    this.nsLoggers[ns] = nsl;

    return nsl;
  }

  private log(level: LoggerLevel, namespace: string, ...msgs: unknown[]): void {
    const message = msgs
      .map((m) => (typeof m === 'object' ? JSON.stringify(m) : m))
      .join(' ');
    this.winston.log({ message, level, namespace });
  }

  private getFormats(options: Required<LoggerOptions>): Format {
    const customFormat = format.printf((data) => {
      const { level, message, timestamp, namespace } = data as MessageData;
      const time = timestamp ? `${timestamp} ` : '';
      const ns = namespace && ` | ${this.formatNamespace(namespace)}`;

      return `${time}[${level}${ns}] ${message}`;
    });

    const formats: Format[] = [];
    if (options.disableColors) formats.push(format.colorize());
    if (options.addTimestamp) formats.push(format.timestamp());
    formats.push(customFormat);

    return format.combine(...formats);
  }
}
