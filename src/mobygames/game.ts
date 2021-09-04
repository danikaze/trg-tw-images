import { Platform } from '.';

export class MobyGamesGame {
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  public async load(): Promise<void> {}

  public getReleaseYear() {}

  public getPlatform(): Platform {
    const re = /mobygames\.com\/game\/([^\\]+)\/[^\\]+/;
    const match = re.exec(this.url);
    if (!match) {
      throw new Error(`Can't extract platform from ${this.url}`);
    }
    return match[1] as Platform;
  }

  public getOtherPlatforms(): string[] {
    return [];
  }

  public getCoverArtList(): string[] {
    return [];
  }

  public getScreenshotList(): string[] {
    return [];
  }
}
