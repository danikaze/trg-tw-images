import { getLogger } from '@utils/logger';
import { join } from 'path';
import { TweetLang } from 'src/game-source/types';

const logger = getLogger();

const DEFAULT_PATH_TEMP_FOLDER = join(__dirname, 'temp');
const DEFAULT_PATH_DATA_FOLDER = join(__dirname, 'data');

const REQUIRED_ENV_VARS: (keyof AppEnvVars)[] = ['LANG'];

export interface AppEnvVars {
  LANG: TweetLang;
  BLUESKY_ACCOUNT_NAME?: string;
  BLUESKY_PASSWORD?: string;
  TWITTER_ACCOUNT_NAME?: string;
  TWITTER_API_KEY?: string;
  TWITTER_API_KEY_SECRET?: string;
  TWITTER_ACCESS_TOKEN?: string;
  TWITTER_ACCESS_TOKEN_SECRET?: string;
  PATH_TEMP_FOLDER: string;
  PATH_DATA_FOLDER: string;
}

export const envVars: AppEnvVars = (() => {
  const lang = (() => {
    // check that the provided language is one of the accepted ones (and normalize it)
    const inputLangLc = (process.env.LANG || '').toLowerCase();
    const acceptedLangs = Object.values(TweetLang);
    for (const acceptedLang of acceptedLangs) {
      if (inputLangLc === acceptedLang.toLowerCase()) {
        return acceptedLang;
      }
    }
  })()!;

  const vars: AppEnvVars = {
    LANG: lang,
    BLUESKY_ACCOUNT_NAME: process.env.BLUESKY_ACCOUNT_NAME,
    BLUESKY_PASSWORD: process.env.BLUESKY_PASSWORD,
    TWITTER_ACCOUNT_NAME: process.env.TWITTER_ACCOUNT_NAME,
    TWITTER_API_KEY: process.env.TWITTER_API_KEY,
    TWITTER_API_KEY_SECRET: process.env.TWITTER_API_KEY_SECRET,
    TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    PATH_TEMP_FOLDER: process.env.PATH_TEMP_FOLDER || DEFAULT_PATH_TEMP_FOLDER,
    PATH_DATA_FOLDER: process.env.PATH_DATA_FOLDER || DEFAULT_PATH_DATA_FOLDER,
  };

  const missing = REQUIRED_ENV_VARS.filter(
    (name) => process.env[name] === undefined
  ).map((name) => ` - process.env.${name}`);

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
