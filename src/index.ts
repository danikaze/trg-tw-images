import { getCliOptions } from '@utils/cli-options';
import { loggerSystem } from '@utils/logger';
import { App } from './app';
import { db } from './db';

const logger = loggerSystem.getLogger();

async function run(): Promise<void> {
  const cliOptions = getCliOptions();
  logger.info('Starting with options', cliOptions);
  db.load();
  const app = new App(cliOptions);
  await app.run();
}

run();

// empty export for --isolatedModules compiler options in the entry point
export {};
