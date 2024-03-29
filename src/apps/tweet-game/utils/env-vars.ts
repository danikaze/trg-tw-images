import { getLogger } from '@utils/logger';
import { join } from 'path';

const logger = getLogger();
const DEFAULT_PATH_TEMP_FOLDER = join(__dirname, 'temp');
const DEFAULT_PATH_DATA_FOLDER = join(__dirname, 'data');

export interface AppEnvVars {
  TWITTER_ACCOUNT_NAME: string;
  TWITTER_API_KEY: string;
  TWITTER_API_KEY_SECRET: string;
  TWITTER_ACCESS_TOKEN: string;
  TWITTER_ACCESS_TOKEN_SECRET: string;
  PATH_TEMP_FOLDER: string;
  PATH_DATA_FOLDER: string;
}

export const envVars: AppEnvVars = (() => {
  const vars: Partial<AppEnvVars> = {
    TWITTER_ACCOUNT_NAME: process.env.TWITTER_ACCOUNT_NAME,
    TWITTER_API_KEY: process.env.TWITTER_API_KEY,
    TWITTER_API_KEY_SECRET: process.env.TWITTER_API_KEY_SECRET,
    TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    PATH_TEMP_FOLDER: process.env.PATH_TEMP_FOLDER || DEFAULT_PATH_TEMP_FOLDER,
    PATH_DATA_FOLDER: process.env.PATH_DATA_FOLDER || DEFAULT_PATH_DATA_FOLDER,
  };

  const missing = Object.entries(vars)
    .filter(([name, value]) => value === undefined)
    .map(([name]) => ` - process.env.${name}`);

  if (missing.length > 0) {
    logger.error(
      `The following environment variables are not defined:\n${missing.join(
        '\n'
      )}`
    );
    process.exit(1);
  }

  return vars as AppEnvVars;
})();
