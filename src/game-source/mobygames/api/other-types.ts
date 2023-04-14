/* eslint-disable no-magic-numbers */

export interface ApiPlatform {
  platform_id: number;
  platform_name: string;
}

export const enum ApiErrorCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
}

export interface ApiGameAttribute {
  attribute_category_id: number;
  attribute_category_name: string;
  attribute_id: number;
  attribute_name: string;
}

export interface ApiCompany {
  company_id: number;
  company_name: string;
  role: string;
}

export interface ApiGameRelease {
  companies: ApiCompany[];
  countries: string[];
  description: string | null;
  product_codes: [];
  release_date: string;
}

export interface ApiGameGenre {
  genre_category: string;
  genre_category_id: number;
  genre_id: number;
  genre_name: string;
}

export interface ApiPlatformRelease {
  first_release_date: string;
  platform_id: ApiPlatform['platform_id'];
  platform_name: ApiPlatform['platform_name'];
}

export interface ApiGamePlatformCover {
  width: number;
  height: number;
  comments: string | null;
  description: string | null;
  image: string;
  scan_of: string;
  thumbnail_image: string;
}

export interface ApiGamePlatformCoverGroup {
  comments: null;
  countries: string[];
  covers: ApiGamePlatformCover[];
}

export interface ApiCover {
  width: number;
  height: number;
  image: string;
  platforms: ApiPlatform['platform_name'][];
  thumbnail_image: string;
}

export interface ApiScreenshot {
  width: number;
  height: number;
  image: string;
  thumbnail_image: string;
  caption: string;
}

export interface ApiGamePlatformRelease {
  attributes: ApiGameAttribute[];
  first_release_date: string;
  game_id: number;
  patches: [];
  platform_id: ApiPlatform['platform_id'];
  platform_name: ApiPlatform['platform_name'];
  ratings: [];
  releases: ApiGameRelease[];
}
