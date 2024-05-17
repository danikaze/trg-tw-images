import { ElementHandle, Page } from 'puppeteer';
import { waitFor } from '@utils/wait-for';
import { getLogger } from '@utils/logger';

const logger = getLogger('Twitter');

export interface TwitterPageOptions {
  /** Twitter username */
  username: string;
  /** Twitter password */
  password: string;
  /** When `true`, display the UI (useful for debugging) */
  ui?: boolean;
}

export enum TwitterPageType {
  FRONT = 'FRONT',
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  TWEET = 'TWEET',
  POST = 'POST',
  OTHER = 'OTHER',
}

export enum TwittePageError {
  WRONG_PAGE = 'WRONG_PAGE',
  WRONG_USER = 'WRONG_USER',
  WRONG_DOM = 'WRONG_DOM',
}

export class TwitterPage {
  // eslint-disable-next-line no-magic-numbers
  private static readonly DELAY_AFTER_INPUT = 130;
  private static readonly VIRTUAL_MOUSE_ID = '___VirtualMouse';
  private static readonly selector = {
    signInButton: 'a[href$="/login"]',
    userInput: 'input[name="text"]',
    passwordInput: 'input[name="password"]',
  };

  private readonly page: Page;
  private readonly options: TwitterPageOptions;

  constructor(page: Page, options: TwitterPageOptions) {
    this.page = page;
    this.options = options;
  }

  /**
   * Load the home page (timeline), login if needed
   */
  public async loadHome(): Promise<void> {
    await this.load('https://twitter.com/home');

    const type = this.getType();
    if (type !== TwitterPageType.HOME) {
      await this.login();
      await this.load('https://twitter.com/home');
    }
  }

  /**
   * Wraps page.load and waits for the dom to be loaded
   */
  private async load(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForNavigation({ waitUntil: 'load' });
  }

  private async type(
    elem: ElementHandle<Element> | null,
    text: string
  ): Promise<void> {
    const MIN_DELAY = 20;
    const MAX_DELAY = 50;

    if (!elem) {
      throw new Error(TwittePageError.WRONG_DOM);
    }

    await this.moveMouseTo(elem);

    for (const char of text) {
      const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
      await waitFor(delay);
      elem.type(char);
    }

    await waitFor(TwitterPage.DELAY_AFTER_INPUT);
  }

  private async click(elem: ElementHandle<Element> | null): Promise<void> {
    if (!elem) {
      throw new Error(TwittePageError.WRONG_DOM);
    }
    await this.moveMouseTo(elem);
    await elem.click();

    await waitFor(TwitterPage.DELAY_AFTER_INPUT);
  }

  private async moveMouseTo(elem: ElementHandle<Element>): Promise<void> {
    const bounds = await elem.boundingBox();

    if (!bounds) {
      throw new Error(TwittePageError.WRONG_DOM);
    }

    const x = bounds.x + bounds.width / 2;
    const y = bounds.y + bounds.height / 2;
    await this.page.mouse.move(x, y, { steps: 300 });
  }

  private getType(): TwitterPageType {
    const url = new URL(this.page.url());

    if (url.pathname === '/home') {
      return TwitterPageType.HOME;
    }

    if (url.pathname === '/compose/post') {
      return TwitterPageType.POST;
    }

    if (url.pathname === '/') {
      return TwitterPageType.FRONT;
    }

    if (/^\/[^\/]+\/status\/\d+$/.test(url.pathname)) {
      return TwitterPageType.TWEET;
    }

    if (url.pathname === '/i/flow/login' || url.pathname === '/login') {
      return TwitterPageType.LOGIN;
    }

    return TwitterPageType.OTHER;
  }

  private async login(): Promise<void> {
    const TRANSITION_TIME = 500;
    this.startVisualMouse();
    logger.verbose(`Attempting to login from ${this.getType()}`);

    // if the timeline loads, we are logged in
    if (this.getType() === TwitterPageType.HOME) {
      logger.verbose(`Already in HOME, ended.`);
      return;
    }

    if (
      this.getType() !== TwitterPageType.LOGIN &&
      this.getType() !== TwitterPageType.FRONT
    ) {
      logger.verbose(`Navigating to https://twitter.com`);
      // load twitter
      await this.load('https://twitter.com/');
    }

    await waitFor(300 + Math.random() * 300);

    if (this.getType() === TwitterPageType.FRONT) {
      logger.verbose(`Clicking Sign In button`);
      await waitFor(TRANSITION_TIME);
      await this.click(await this.signInButton());
    }
    await waitFor(1000 + Math.random() * 300);

    // if the login page doesn't load, something's off
    if (this.getType() !== TwitterPageType.LOGIN) {
      logger.error(
        `Expected page to be LOGIN. Currently in ${this.getType()} (${this.page.url()})`
      );
      await waitFor(TRANSITION_TIME);
      throw new Error(TwittePageError.WRONG_PAGE);
    }

    // start login process
    const { username, password } = this.options;

    logger.verbose(`Input username`);
    await waitFor(TRANSITION_TIME);
    await this.type(await this.loginUserInput(), username);
    await this.page.keyboard.press('Enter');

    logger.verbose(`Input password`);
    await waitFor(TRANSITION_TIME);
    await this.type(await this.loginPassword(), password);
    await this.page.keyboard.press('Enter');
  }

  private async signInButton(): Promise<ElementHandle | null> {
    return this.page.waitForSelector(TwitterPage.selector.signInButton);
  }

  private async loginUserInput(): Promise<ElementHandle | null> {
    return this.page.waitForSelector(TwitterPage.selector.userInput);
  }

  private async loginPassword(): Promise<ElementHandle | null> {
    return this.page.waitForSelector(TwitterPage.selector.passwordInput);
  }

  /**
   * Select a button (div[role="button"]) with the provided text
   */
  private async roleButton(text: string): Promise<ElementHandle | null> {
    const getButton = () =>
      this.page.evaluateHandle(
        (text) =>
          Array.from(document.querySelectorAll('[role="button"]')).filter(
            (el) => new RegExp(text, 'i').test(el.innerHTML)
          )[0],
        text
      );

    return waitFor(getButton) || null;
  }

  private async startVisualMouse(): Promise<void> {
    const elem = await this.page.$(`#${TwitterPage.VIRTUAL_MOUSE_ID}`);
    if (elem) return;

    await this.page.evaluate((elemId) => {
      const vm = document.createElement('div');
      vm.id = elemId;
      document.body.appendChild(vm);
      vm.style.setProperty('pointer-events', 'none');
      vm.style.setProperty('position', 'fixed');
      vm.style.setProperty('width', '5px');
      vm.style.setProperty('height', '5px');
      vm.style.setProperty('background', 'red');

      const handler = (event: MouseEvent) => {
        const vm = document.getElementById(elemId);
        if (!vm) {
          removeEventListener('mousemove', handler);
          return;
        }
        vm.style.setProperty('left', `${event.clientX}px`);
        vm.style.setProperty('top', `${event.clientY}px`);
      };
      addEventListener('mousemove', handler);
    }, TwitterPage.VIRTUAL_MOUSE_ID);
  }

  private async stopVisualMouse(): Promise<void> {
    const elem = await this.page.$(`#${TwitterPage.VIRTUAL_MOUSE_ID}`);
    if (!elem) return;
  }
}
