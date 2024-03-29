import { readFile as rf } from 'fs';
import { promisify } from 'util';
import { extname } from 'path';
import { default as Twit } from 'twit';
import { IMAGES_INCLUDE_ALT } from '@utils/constants';
import { getLogger } from '@utils/logger';
import { gif2png } from '@utils/gif-to-png';
import { envVars } from 'src/apps/tweet-game/utils/env-vars';

const readFile = promisify(rf);
const logger = getLogger('Twitter');

export interface TwitterImageInfo {
  filePath: string;
  alt?: string;
}

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

export class Twitter {
  protected readonly twit: Twit;
  protected readonly accountName: string;

  constructor(accountName: string) {
    this.accountName =
      accountName[0] === '@' ? accountName.substring(1) : accountName;
    this.twit = new Twit({
      consumer_key: envVars.TWITTER_API_KEY!,
      consumer_secret: envVars.TWITTER_API_KEY_SECRET!,
      access_token: envVars.TWITTER_ACCESS_TOKEN!,
      access_token_secret: envVars.TWITTER_ACCESS_TOKEN_SECRET!,
    });
  }

  /**
   * Tweet text with images
   */
  public async tweetImages(
    text: string,
    images: TwitterImageInfo[]
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
  protected async uploadImage(image: TwitterImageInfo): Promise<string> {
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
