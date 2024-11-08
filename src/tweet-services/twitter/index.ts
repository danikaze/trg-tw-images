import { IMAGES_INCLUDE_ALT } from '@utils/constants';
import { gif2png } from '@utils/gif-to-png';
import { getLogger } from '@utils/logger';
import { readFile } from 'fs/promises';
import { extname } from 'path';
import { envVars } from 'src/apps/tweet-game/utils/env-vars';
import { TweetLang } from 'src/game-source/types';
import Twit from 'twit';

import { TweetImageInfo, TweetService, TweetServiceType } from '..';

const logger = getLogger('Twitter');

interface TweetData {
  status: string;
  media_ids?: string[];
}

interface MediaUploadResponse {
  expires_after_secs: number;
  image: {
    image_type: string;
    w: number;
    h: number;
  };
  media_id: number;
  media_id_string: string;
  size: number;
}

export class Twitter extends TweetService {
  public readonly serviceName: TweetServiceType = 'twitter';
  // eslint-disable-next-line no-magic-numbers
  public readonly textMaxChars: number = 280;

  protected readonly twit: Twit;
  protected readonly accountName: string;

  constructor() {
    super();

    if (!Twitter.isEnabled()) {
      throw new Error('Twitter API keys are not set');
    }

    const rawAccountName = envVars.TWITTER_ACCOUNT_NAME!;

    this.accountName =
      rawAccountName[0] === '@' ? rawAccountName.substring(1) : rawAccountName;
    this.twit = new Twit({
      consumer_key: envVars.TWITTER_API_KEY!,
      consumer_secret: envVars.TWITTER_API_KEY_SECRET!,
      access_token: envVars.TWITTER_ACCESS_TOKEN!,
      access_token_secret: envVars.TWITTER_ACCESS_TOKEN_SECRET!,
    });
  }

  public static isEnabled(): boolean {
    return Boolean(
      envVars.TWITTER_API_KEY &&
        envVars.TWITTER_API_KEY_SECRET &&
        envVars.TWITTER_ACCESS_TOKEN &&
        envVars.TWITTER_ACCESS_TOKEN_SECRET
    );
  }

  /**
   * Tweet text with images
   */
  public async tweetImages(
    text: string,
    images: TweetImageInfo[],
    langs: TweetLang[]
  ): Promise<string | undefined> {
    const media_ids = await Promise.all(
      images.map((image) => this.uploadImage(image))
    );

    return this.tweet({
      status: text,
      media_ids,
    });
  }

  /**
   * Generic tweet method
   */
  protected async tweet(data?: TweetData): Promise<string | undefined> {
    try {
      const res = await this.twit.post('statuses/update', data);
      const tweetId = (res.data as Twit.Twitter.Status).id_str;
      const tweetUrl = `https://twitter.com/${this.accountName}/status/${tweetId}`;
      logger.info(`Tweeted: ${tweetUrl}`);
      return tweetUrl;
    } catch (e) {
      // eslint-disable-next-line no-console
      logger.error(e);
    }
  }

  /**
   * Upload an image and return its ID
   */
  protected async uploadImage(image: TweetImageInfo): Promise<string> {
    // twitter only allows 1 image if a gif is include, and since we are
    // handling screenshots here, we just convert them to png before
    // uploading them
    if (extname(image.filePath) === '.gif') {
      image.filePath = await gif2png(image.filePath);
    }

    const b64content = await readFile(image.filePath, { encoding: 'base64' });
    const mediaData = await this.twit.post('media/upload', {
      media_data: b64content,
    });
    const mediaId = (mediaData.data as MediaUploadResponse).media_id_string;

    if (!IMAGES_INCLUDE_ALT || !image.alt) {
      return mediaId;
    }

    await this.twit.post('media/metadata/create', {
      media_id: mediaId,
      alt_text: { text: image.alt },
    });

    return mediaId;
  }
}
