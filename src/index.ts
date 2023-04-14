import { getCliOptions } from '@utils/cli-options';
import { getLogger } from '@utils/logger';
import { App } from './apps/tweet-game';

const logger = getLogger();

/**
 * Entry point for the application
 */
async function run(): Promise<void> {
  logger.info('↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓');

  const cliOptions = getCliOptions();

  try {
    logger.info(
      `Starting (v${PACKAGE_VERSION}). cli-options: ${JSON.stringify(
        cliOptions,
        null,
        2
      )}`
    );
    const app = new App(cliOptions);
    await app.run();
  } catch (error) {
    logger.error('Unexpected error:', (error as Error).stack);
  }
  logger.info('↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑\n');
}

run();

// empty export for --isolatedModules compiler options in the entry point
export {};
