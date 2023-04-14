import { getLogger } from '@utils/logger';
import { join } from 'path';
import { envVars } from 'src/apps/tweet-game/utils/env-vars';
import { Game } from 'src/game-source/types';
import { createJsonDb, JsonDb } from 'src/json-db';

const logger = getLogger('GameTracker');

export interface TrackerInfo {
  key: string; // Game['source'] + Game['id'];
  gameName: Game['title'];
  tweetUrl: string;
  date: string;
}

export interface TweetTrackerOptions {
  length?: number;
  filePath?: string;
}

export class TweetTracker {
  private readonly options: Required<TweetTrackerOptions>;
  private readonly db: JsonDb<{ lastTweets: TrackerInfo[] }>;

  constructor(options?: TweetTrackerOptions) {
    this.options = {
      length: 1000,
      filePath: join(envVars.PATH_DATA_FOLDER, 'tweet-tracker.json'),
      ...options,
    };
    this.db = createJsonDb(this.options.filePath, {
      initialData: {
        lastTweets: [] as TrackerInfo[],
      },
    });
  }

  protected static getKey(game: Game): TrackerInfo['key'] {
    return `${game.source}:${game.id}`;
  }

  protected static getInfo(game: Game, tweetUrl: string): TrackerInfo {
    return {
      key: TweetTracker.getKey(game),
      gameName: game.title,
      tweetUrl,
      date: new Date().toString(),
    };
  }

  public gameExists(game: Game): boolean {
    if (!this.db.data) return false;
    const key = TweetTracker.getKey(game);
    const exists = this.db.data.lastTweets.find((info) => info.key === key);
    if (exists) {
      logger.info(`Game already tracked: ${key} (${game.title})`);
      return true;
    }
    logger.debug(`Game not tracked: ${key} (${game.title})`);
    return false;
  }

  public addGame(game: Game, tweetUrl: string): void {
    const info = TweetTracker.getInfo(game, tweetUrl);
    const lastTweets = [...this.db.data.lastTweets, info];
    this.db.update({
      lastTweets: lastTweets.slice(
        Math.max(0, lastTweets.length - this.options.length)
      ),
    });
    logger.info(`Game added: ${info}`);
  }
}
