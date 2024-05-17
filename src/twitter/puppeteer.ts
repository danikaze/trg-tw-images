import { existsSync } from 'fs';
import { Browser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AnonUaPlugin from 'puppeteer-extra-plugin-anonymize-ua';

import { TwitterImageInfo } from '.';
import { TwitterPage, TwitterPageOptions } from './page';

puppeteer.use(StealthPlugin());
puppeteer.use(AnonUaPlugin());

export interface TweetData {
  text: string;
  images?: TwitterImageInfo[];
}

export enum TwitterPageType {
  FRONT = 'FRONT',
  LOGIN_USERNAME = 'LOGIN_USERNAME',
  LOGIN_PASSWORD = 'LOGIN_PASSWORD',
  TIMELINE = 'TIMELINE',
  TWEET = 'TWEET',
  POST = 'POST',
  OTHER = 'OTHER',
}

export class TwitterPuppeteer {
  private static browser: Browser;
  private readonly options: TwitterPageOptions;

  constructor(options: TwitterPageOptions) {
    this.options = options;
  }

  /**
   * Check that the provided data is correct or return a list of errors
   */
  private static validateTweetData(data: TweetData): string[] | undefined {
    const MAX_IMAGES = 4;
    const errors: string[] = [];

    if (data.images) {
      if (data.images.length > MAX_IMAGES) {
        errors.push(`Maximum allowed images is ${MAX_IMAGES}`);
      }

      for (const { filePath } of data.images) {
        if (!existsSync(filePath)) {
          errors.push(`Image not found on "${filePath}"`);
        }
      }
    }

    return errors.length ? errors : undefined;
  }

  private static async getBrowser(ui?: boolean): Promise<Browser> {
    if (!TwitterPuppeteer.browser) {
      TwitterPuppeteer.browser = await puppeteer.launch({
        headless: !ui,
      });
    }
    return TwitterPuppeteer.browser;
  }

  /**
   * Tweet the provided data and return the new tweet URL
   */
  public async tweet(data: TweetData): Promise<string> {
    const validationErrors = TwitterPuppeteer.validateTweetData(data);
    if (validationErrors) {
      throw new Error(validationErrors.join('\n'));
    }

    const browser = await TwitterPuppeteer.getBrowser(this.options.ui);
    const emptyPages = (await browser.pages()).filter(
      (page) => page.url() === 'about:blank'
    );
    const page = emptyPages[0] ?? (await browser.newPage());
    await page.setViewport({ width: 1400, height: 800 });

    const tw = new TwitterPage(page, this.options);
    await tw.loadHome();

    return '';
  }
}
