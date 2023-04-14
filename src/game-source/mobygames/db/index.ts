import { join } from 'path';
import { PATH_DATA_FOLDER } from '@utils/constants';
import { createJsonDb } from 'src/json-db';
import { GamesDb, PlatformsDb } from './types';

const MOBYGAMES_DATA_FOLDER = join(PATH_DATA_FOLDER, 'mobygames');
const PLATFORMS_DB_FILE = join(MOBYGAMES_DATA_FOLDER, 'platforms.json');
const GAMES_DB_FILE = join(MOBYGAMES_DATA_FOLDER, 'games.json');

export const platformDb = createJsonDb<PlatformsDb>(PLATFORMS_DB_FILE, {
  initialData: {
    totalPlatforms: 0,
    platforms: [],
  },
});

export const gamesDb = createJsonDb<GamesDb>(GAMES_DB_FILE, {
  initialData: {
    totalGames: 0,
    games: [],
  },
});
