import { PLATFORM_NAMES } from './constants/platform';

export type GameSourceType = 'mobygames';

export type PlatformType = keyof typeof PLATFORM_NAMES;

export interface Platform {
  type: PlatformType;
  name: string;
}

export const enum CoverArtType {
  FRONT_COVER = 'FRONT_COVER',
  BACK_COVER = 'BACK_COVER',
  INSIDE_COVER = 'INSIDE_COVER',
  SPINE_SIDE = 'SPINE_SIDE',
  MEDIA = 'MEDIA',
  MANUAL = 'MANUAL',
  JEWEL_CASE_FRONT = 'JEWEL_CASE_FRONT',
  JEWEL_CASE_BACK = 'JEWEL_CASE_BACK',
  REFERENCE_CARD = 'REFERENCE_CARD',
  EXTRAS = 'EXTRAS',
  OTHER = 'OTHER',
}

export interface ImageInfo {
  url: string;
  caption?: string;
}

export interface CoverGroup {
  countries: string[];
  covers: CoverInfo[];
}

export interface CoverInfo {
  url: string;
  scanOf?: CoverArtType;
}

export interface Game {
  source: GameSourceType;
  id: string | number;
  title: string;
  platform: PlatformType;
  year?: number;
  otherPlatforms: PlatformType[];
  screenshots: ImageInfo[];
  covers: CoverGroup[];
}
