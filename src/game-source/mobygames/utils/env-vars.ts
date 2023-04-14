import { getLogger } from '@utils/logger';

export interface MobyGamesEnvVars {
  MG_GAMES_UPDATES_PER_RUN?: number;
  MG_API_KEY: string;
}

const logger = getLogger();

export const envVars: MobyGamesEnvVars = (() => {
  const vars = {
    MG_GAMES_UPDATES_PER_RUN: process.env.MG_GAMES_UPDATES_PER_RUN,
    MG_API_KEY: process.env.MG_API_KEY,
  };

  const requiredEnvVars: (keyof MobyGamesEnvVars)[] = ['MG_API_KEY'];
  const numericEnvVars: (keyof MobyGamesEnvVars)[] = [
    'MG_GAMES_UPDATES_PER_RUN',
  ];

  const missing = requiredEnvVars
    .filter((name) => vars[name] === undefined)
    .map(([name]) => ` - process.env.${name}`);

  if (missing.length > 0) {
    logger.error(
      `The following environment variables are not defined:\n${missing.join(
        '\n'
      )}`
    );
    process.exit(1);
  }

  const notNumeric = numericEnvVars
    .filter((name) => vars[name] !== undefined && isNaN(Number(vars[name])))
    .map(([name]) => ` - process.env.${name}`);

  if (notNumeric.length > 0) {
    logger.error(
      `The following environment variables need to be numeric:\n${notNumeric.join(
        '\n'
      )}`
    );
    process.exit(1);
  }

  return {
    ...vars,
    MG_GAMES_UPDATES_PER_RUN: Number(vars.MG_GAMES_UPDATES_PER_RUN),
  } as MobyGamesEnvVars;
})();
