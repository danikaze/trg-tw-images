export type TweetServiceType = 'twitter' | 'bsky';

export interface TweetImageInfo {
  filePath: string;
  alt?: string;
}

export interface TweetServiceStatic {
  isEnabled: () => boolean;
}

export abstract class TweetService implements TweetServiceStatic {
  public abstract readonly serviceName: TweetServiceType;
  public abstract readonly textMaxChars: number;

  public isEnabled(): boolean {
    throw new Error(
      `Implement isEnabled() in the class extending TweetService`
    );
  }

  /**
   * Tweet text with images
   */
  public abstract tweetImages(
    text: string,
    images: TweetImageInfo[]
  ): Promise<string | undefined>;
}
