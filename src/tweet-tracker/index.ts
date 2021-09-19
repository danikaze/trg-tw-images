import { getLogger } from '@utils/logger';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const logger = getLogger('GameTracker');

export interface TrackerInfo {
  gameName: string;
  gameUrl: string;
  tweetUrl: string;
  date: string;
}

export class TweetTracker {
  protected trackList: TrackerInfo[] | undefined;

  constructor() {
    this.load();
  }

  public gameExists(gameUrl: string): boolean {
    if (!this.trackList) return false;
    const exists = this.trackList.find((info) => info.gameUrl === gameUrl);
    if (exists) {
      logger.info(`Game already tracked: ${gameUrl}`);
      return true;
    }
    logger.info(`Game not tracked: ${gameUrl}`);
    return false;
  }

  public addGame(info: TrackerInfo): void {
    if (!this.trackList) {
      this.trackList = [info];
    } else {
      this.trackList.push(info);
    }
    logger.info(`Game added: ${info}`);
    this.save();
  }

  protected load(): void {
    try {
      if (!existsSync(NO_REPEAT_GAMES_PATH)) {
        this.trackList = [];
        logger.info(`No tracker file found`);
        return;
      }

      const contents = readFileSync(NO_REPEAT_GAMES_PATH).toString();
      this.trackList = JSON.parse(contents) as TrackerInfo[];
      logger.info(
        `Tracker loaded with ${this.trackList.length}/${NO_REPEAT_GAMES} games`
      );
    } catch (e) {
      this.trackList = undefined;
      logger.error(`Error loading file ${NO_REPEAT_GAMES_PATH}`, e);
    }
  }

  protected save(): void {
    if (!this.trackList) return;

    try {
      const first = Math.max(0, this.trackList.length - NO_REPEAT_GAMES);
      const data = this.trackList.slice(first);
      const contents = JSON.stringify(data, null, 2);

      writeFileSync(NO_REPEAT_GAMES_PATH, contents);
      logger.info(
        `File ${NO_REPEAT_GAMES_PATH} saved with ${data.length} games tracked`
      );
    } catch (e) {
      logger.error(`Error writing file ${NO_REPEAT_GAMES_PATH}`, e);
    }
  }
}
