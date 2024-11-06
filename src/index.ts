import { getCliOptions } from '@utils/cli-options';
import { getLogger } from '@utils/logger';
import { App } from './apps/tweet-game';
import { getEnabledTweetServices } from './tweet-services/get';

const logger = getLogger();

/**
 * Entry point for the application
 */
async function run(): Promise<void> {
  logger.info('↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓');

  const cliOptions = getCliOptions();
  const services = getEnabledTweetServices();

  try {
    logger.info(
      [
        `Starting (v${PACKAGE_VERSION} on Node ${process.version}).`,
        `services: ${services.map((s) => s.serviceName).join(', ')}`,
        `cli-options: ${JSON.stringify(cliOptions, null, 2)}`,
      ].join('\n')
    );
    const app = new App({ ...cliOptions, services });
    await app.run();
  } catch (error) {
    logger.error('Unexpected error:', (error as Error).stack);
  }
  logger.info('↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑\n');
}

run();

// empty export for --isolatedModules compiler options in the entry point
export {};
