import { AtpAgent, BlobRef, ComAtprotoServerCreateSession } from '@atproto/api';
import { getLogger } from '@utils/logger';
import { resizeImage } from '@utils/resize-image';
import { readFile } from 'fs/promises';
import { envVars } from 'src/apps/tweet-game/utils/env-vars';
import { TweetLang } from 'src/game-source/types';
import { TweetImageInfo, TweetService, TweetServiceType } from '..';

const logger = getLogger('Bluesky');

interface UploadImageData {
  blob: BlobRef;
  width: number;
  height: number;
  alt?: string;
}

type PostResult = Partial<{
  cid: string;
  commit: {
    cid: string;
    rev: string;
  };
  uri: string;
  validationStatus: string;
}>;

const LANGS: Record<TweetLang, string> = {
  [TweetLang.ES]: 'es-ES',
  [TweetLang.EN]: 'en-US',
};

export class Bsky extends TweetService {
  public readonly serviceName: TweetServiceType = 'bsky';
  // eslint-disable-next-line no-magic-numbers
  public readonly textMaxChars: number = 300;
  /** https://docs.bsky.app/docs/advanced-guides/posts#images-embeds */
  // eslint-disable-next-line no-magic-numbers
  public readonly imageMaxSize: number = 1_000_000;

  protected readonly agent: AtpAgent;
  protected loggedIn: ComAtprotoServerCreateSession.Response | undefined;

  constructor() {
    super();

    if (!Bsky.isEnabled()) {
      throw new Error('Bluesky environment variables are not set');
    }

    this.agent = new AtpAgent({ service: 'https://bsky.social' });
  }

  public static isEnabled(): boolean {
    return Boolean(envVars.BLUESKY_ACCOUNT_NAME && envVars.BLUESKY_PASSWORD);
  }

  /**
   * Tweet text with images
   */
  public async tweetImages(
    text: string,
    images: TweetImageInfo[],
    langs: TweetLang[]
  ): Promise<string | undefined> {
    try {
      if (!this.loggedIn) {
        this.loggedIn = await this.agent.login({
          identifier: envVars.BLUESKY_ACCOUNT_NAME!,
          password: Buffer.from(envVars.BLUESKY_PASSWORD!, 'base64').toString(),
        });
      }

      const imageData = (
        await Promise.all(images.map((image) => this.uploadImage(image)))
      ).filter((data) => data !== undefined);

      if (imageData.length === 0) {
        logger.error(`No images were uploaded successfully`);
        return;
      } else if (imageData.length < images.length) {
        logger.warn(
          `${images.length - imageData.length} images failed on the upload`
        );
      }

      const postRes = await this.agent.post({
        text,
        langs: langs.map((lang) => LANGS[lang]),
        createdAt: new Date().toISOString(),
        embed: {
          $type: 'app.bsky.embed.images',
          images: imageData.map(({ alt, blob, width, height }) => ({
            alt: alt || '',
            image: blob,
            aspectRatio: { width, height },
          })),
        },
      });

      return this.getPostUrl(postRes);
    } catch (e) {
      logger.error(String(e));
    }
  }

  protected async uploadImage(
    image: TweetImageInfo
  ): Promise<UploadImageData | undefined> {
    const resizedImage = await resizeImage({
      imagePath: image.filePath,
      maxSize: this.imageMaxSize,
    });

    try {
      const file = await readFile(resizedImage.path);
      const res = await this.agent.uploadBlob(file);
      return {
        blob: res.data.blob,
        alt: image.alt,
        width: resizedImage.width,
        height: resizedImage.height,
      };
    } catch (e) {
      logger.error(`Error while uploading image`, e);
    }
  }

  protected getPostUrl(data: PostResult): string | undefined {
    const baseUrl = 'https://bsky.app/profile/';
    const account = envVars.BLUESKY_ACCOUNT_NAME!;
    const rev = /post\/(.*)$/.exec(data.uri!)?.[1];
    const url = rev ? `${baseUrl}${account}/post/${rev}` : undefined;

    logger.debug(`getPostUrl(${JSON.stringify(data, null, 2)}) = ${url}`);
    return url;
  }
}
