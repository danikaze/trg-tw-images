import { Platform } from '.';
import { PLATFORM_NAMES } from './constants';

export class MobyGamesPlatform {
  private readonly platform: Platform;

  constructor(platform: Platform) {
    this.platform = platform;
  }

  public getName(): string {
    return PLATFORM_NAMES[this.platform];
  }

  public async getRandomGameUrl(): Promise<string> {
    return '';
  }
}
