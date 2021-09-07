import { PLATFORM_NAMES } from './mobygames/constants';

export interface AppOptions {
  dry: boolean;
  gameUrl?: string;
  platform?: Platform;
  year?: number;
}

export type Platform = keyof typeof PLATFORM_NAMES;

export type ImageType = 'screenshot' | 'cover-art' | 'promo-art';

export interface GameInfo {
  url: string;
  name: string;
  year: number;
}

export interface ImageInfo {
  url: string;
  filePath: string;
  type?: ImageType;
  coverArtType?: CoverArtType;
  alt?: string;
  countries?: string[];
}

export type ThumbnailInfo = Omit<ImageInfo, 'filePath'>;

export type CoverArtType =
  | 'front-cover'
  | 'back-cover'
  | 'side'
  | 'media'
  | 'manual'
  | 'jewel-case-front'
  | 'jewel-case-back'
  | 'other';

export interface GameFullInfo {
  url: string;
  name: string;
  year?: number;
  platform?: Platform;
  otherPlatforms?: Platform[];
  gameCoverImagePageUrl?: string;
  coverArtImagePageUrls?: ThumbnailInfo[];
  screenshotsImagePageUrls?: ThumbnailInfo[];
}
