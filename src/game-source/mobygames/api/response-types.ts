import type {
  ApiErrorCode,
  ApiGameGenre,
  ApiGamePlatformCoverGroup,
  ApiPlatformRelease,
  ApiCover,
  ApiScreenshot,
  ApiPlatform,
} from './other-types';

export interface ApiError {
  code: ApiErrorCode;
  error: string;
  message: string;
}

/*
 * /platforms
 */
export interface ApiPlatforms {
  platforms: ApiPlatform[];
}

/*
 * /games?format=normal
 */
export interface ApiGames {
  games: ApiGame[];
}

/*
 * /games?id={game_id}
 */
export interface ApiGame {
  title: string;
  alternate_titles: string[];
  description: string;
  game_id: number;
  genres: ApiGameGenre[];
  moby_score: number | null;
  moby_url: string;
  num_votes: number;
  official_url: string | null;
  platforms: ApiPlatformRelease[];
  sample_cover: ApiCover;
  sample_screenshots: ApiScreenshot[];
}

/*
 * /games/{game_id}/platforms/{platform_id}/covers
 */
export interface ApiGamePlatformsCovers {
  cover_groups: ApiGamePlatformCoverGroup[];
}

/*
 * /games/{game_id}/platforms/{platform_id}/screenshots
 */
export interface ApiGamePlatformsScreenshots {
  screenshots: ApiScreenshot[];
}
