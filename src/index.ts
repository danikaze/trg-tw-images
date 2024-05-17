import { CliOptions, getCliOptions } from '@utils/cli-options';
import { getLogger } from '@utils/logger';
import { interactiveMode } from './apps/tweet-game/utils/interactive-mode';

import type { App } from './apps/tweet-game';

const logger = getLogger();

/**
 * Entry point for the application
 */
async function run(): Promise<void> {
  logger.info('↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓');

  const cliOptions = getCliOptions();

  if (cliOptions.interactiveUser) {
    const input = await interactiveMode();
    process.env.TWITTER_ACCOUNT_NAME = input.username;
    process.env.TWITTER_ACCOUNT_PASS = input.password;
  }

  try {
    logger.info(
      `Starting (v${PACKAGE_VERSION}). cli-options: ${JSON.stringify(
        cliOptions,
        null,
        2
      )}`
    );
    await runApp(cliOptions);
  } catch (error) {
    logger.error('Unexpected error:', (error as Error).stack);
  }
  logger.info('↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑\n');
}

/**
 * Run the App
 * Encapsulated to avoid importing the tweet-game app (that uses envvar) before
 * the cliOptions are read to inject the username and password in process.env
 */
async function runApp(cliOptions: CliOptions): Promise<void> {
  const AppClass = await require('./apps/tweet-game').then(
    (mod: { App: typeof App }) => mod.App
  );
  const app = new AppClass(cliOptions);
  return app.run();
}

async function testPup(): Promise<void> {
  const puppeteer = require('puppeteer-extra');
  const StealthPlugin = require('puppeteer-extra-plugin-stealth');
  const AnonUaPlugin = require('puppeteer-extra-plugin-anonymize-ua');

  puppeteer.use(StealthPlugin());
  puppeteer.use(AnonUaPlugin());

  const browser = await puppeteer.launch({
    headless: false,
  });
  const emptyPages = (await browser.pages()).filter(
    (page) => page.url() === 'about:blank'
  );
  const page = emptyPages[0] ?? (await browser.newPage());
  await page.setViewport({ width: 1400, height: 800 });

  // await page.goto('https://bot.sannysoft.com/');
  await page.goto('https://arh.antoinevastel.com/bots/areyouheadless');
}

run();
// testPup();

// empty export for --isolatedModules compiler options in the entry point
export {};
