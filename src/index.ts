import { getCliOptions } from '@utils/cli-options';
import { getLogger } from '@utils/logger';
import { App } from './app';
import { db } from './db';

const logger = getLogger();

async function run(): Promise<void> {
  const cliOptions = getCliOptions();
  try {
    logger.info('↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓');
    logger.info(
      `Starting (v${PACKAGE_VERSION}). cli-options: ${JSON.stringify(
        cliOptions,
        null,
        2
      )}`
    );
    db.load();
    const app = new App(cliOptions);
    await app.run();
    logger.info('↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑\n');
  } catch (error) {
    logger.error('Unexpected error:', (error as Error).stack);
  }
}

run();

// empty export for --isolatedModules compiler options in the entry point
export {};
