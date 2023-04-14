import { CoverGroup, Game, PlatformType } from '../types';
import { GameSource, GetRandomGameOptions } from '../base';
import {
  fetchGameCoverGroups,
  fetchGameDetails,
  fetchGameScreenshots,
  fetchNewGames,
  fetchPlatforms,
  getCalledTimes,
  MAX_CALLS_PER_HOUR,
} from './api';
import { getPlatformType } from './utils/platform';
import { GameBasicInfo, GameBasicInfoPlatform, PlatformsDb } from './db/types';
import { selectRandom } from '@utils/random';
import { apiGame2gameBasicInfo } from './utils/game';
import { ApiGame } from './api/response-types';
import { gamesDb, platformDb } from './db';
import { logger } from './utils/logger';
import { getCoverArtType } from './utils/cover-art';
import { getDateDetails } from './utils/date';
import { envVars } from './utils/env-vars';

/* eslint-disable no-magic-numbers */
const PLATFORM_DB_TTL = 7 * 86400 * 1000;
const API_CALLS_NEEDED = 5;
const MAX_UPDATED_GAMES_PER_RUN = envVars.MG_GAMES_UPDATES_PER_RUN || 500;
/* eslint-enable no-magic-numbers */

export class MobyGamesGameSource extends GameSource {
  constructor() {
    super('mobygames');
  }

  private static canUseApi(): boolean {
    return MAX_CALLS_PER_HOUR - getCalledTimes() > API_CALLS_NEEDED;
  }

  private static getGameChoosableFn(
    options: GetRandomGameOptions
  ): (game: GameBasicInfo) => boolean {
    if (
      !options.minYear &&
      !options.maxYear &&
      (!options.platforms || !options.platforms.length) &&
      !options.gameId
    ) {
      return () => true;
    }

    const gameId = options.gameId ? Number(options.gameId) : undefined;
    const isGameChoosable = gameId
      ? ({ id }: GameBasicInfo) => gameId === id
      : () => true;
    const isPlatformChoosable =
      MobyGamesGameSource.getPlatformChoosableFn(options);

    return (game) =>
      isGameChoosable(game) &&
      game.platforms.some((platform) => isPlatformChoosable(platform));
  }

  private static getPlatformChoosableFn(
    options: GetRandomGameOptions
  ): (p: GameBasicInfoPlatform) => boolean {
    const { minYear, maxYear, platforms } = options;
    if (!minYear && !maxYear && (!platforms || !platforms.length)) {
      return () => true;
    }

    return (p) =>
      (maxYear ? p.year! <= maxYear : true) &&
      (minYear ? p.year! >= minYear : true) &&
      (platforms ? platforms.includes(p.type) : true);
  }

  public async getRandomGame(
    options: GetRandomGameOptions
  ): Promise<Game | undefined> {
    await this.updateData();
    const isGameChoosable = MobyGamesGameSource.getGameChoosableFn(options);
    const isPlatformChoosable =
      MobyGamesGameSource.getPlatformChoosableFn(options);

    const choosableGames = gamesDb.data.games.filter(isGameChoosable);
    const chosenGame = selectRandom(choosableGames);

    if (!chosenGame) {
      const optionsStr = JSON.stringify(options);
      throw new Error(
        `Can't find a random game matching the specified options (${optionsStr})`
      );
    }

    const choosablePlatforms = chosenGame.platforms.filter(isPlatformChoosable);
    const chosenPlatform = selectRandom(choosablePlatforms);

    if (!chosenPlatform) {
      const optionsStr = JSON.stringify(options);
      throw new Error(
        `Can't find a platform for the game "${chosenGame.title}" ` +
          `that matches the specified options (${optionsStr})`
      );
    }

    return this.fetchGameInfo(chosenGame.id, chosenPlatform.type);
  }

  private async updateData(): Promise<void> {
    await this.updatePlatforms();
    await this.updateGames();
  }

  private async updatePlatforms(): Promise<void> {
    if (
      !MobyGamesGameSource.canUseApi() ||
      Date.now() - platformDb.meta.lastUpdate < PLATFORM_DB_TTL
    ) {
      logger.debug('Platforms are up to date (cache)');
      return;
    }

    logger.info('Updating platforms...');
    const apiPlatforms = await fetchPlatforms();
    logger.info(`Fetched ${apiPlatforms.length} platforms...`);

    const platforms = apiPlatforms.reduce((res, apiPlatform) => {
      const type = getPlatformType(apiPlatform.platform_id);
      if (type) {
        res.push({ type, id: apiPlatform.platform_id });
      }
      return res;
    }, [] as PlatformsDb['platforms']);

    platformDb.update({
      totalPlatforms: platforms.length,
      platforms,
    });
  }

  private async updateGames(): Promise<void> {
    if (!MobyGamesGameSource.canUseApi()) {
      return;
    }

    const newGamesQty = 100;
    const currentTrackedGames = gamesDb.data?.games?.length || 0;
    logger.info(
      `Updating games (currently ${currentTrackedGames}) available...`
    );
    let newGames = 0;
    let nCalls = 0;
    while (
      MobyGamesGameSource.canUseApi() &&
      newGames < MAX_UPDATED_GAMES_PER_RUN
    ) {
      try {
        const apiGames = await fetchNewGames(
          currentTrackedGames + newGames,
          newGamesQty
        );
        nCalls++;
        const infoGames = apiGames.map(apiGame2gameBasicInfo).filter(Boolean);
        newGames += infoGames.length;
        const updatedGames = [...gamesDb.data.games, ...infoGames];
        gamesDb.update({
          totalGames: updatedGames.length,
          games: updatedGames,
        });
        if (infoGames.length < newGamesQty) break;
      } catch (e) {
        logger.warn(`Error while updating games: ${e}`);
        break;
      }
    }
    logger.info(`Fetched ${newGames} new games with ${nCalls} API calls...`);
  }

  private async fetchGameInfo(
    id: ApiGame['game_id'],
    platformType: PlatformType
  ): Promise<Game> {
    const apiGame = await fetchGameDetails(id);
    const apiCoverGroups = await fetchGameCoverGroups(id, platformType);
    const apiScreenshots = await fetchGameScreenshots(id, platformType);

    const otherPlatforms = apiGame.platforms
      .map(({ platform_id }) => getPlatformType(platform_id))
      .filter((type) => !!type && type !== platformType) as PlatformType[];
    const chosenPlatform = apiGame.platforms.find(
      ({ platform_id }) => getPlatformType(platform_id) === platformType
    );
    const releaseDate = getDateDetails(chosenPlatform?.first_release_date);
    const screenshots = apiScreenshots.map((screenshot) => ({
      url: screenshot.image,
      caption: screenshot.caption,
    }));
    const covers: CoverGroup[] = apiCoverGroups.map((group) => ({
      countries: group.countries,
      covers: group.covers.map((cover) => ({
        url: cover.image,
        scanOf: getCoverArtType(cover.scan_of),
      })),
    }));

    // basic information
    const game: Game = {
      source: this.name,
      id: apiGame.game_id,
      title: apiGame.title,
      platform: platformType,
      year: releaseDate?.year,
      otherPlatforms,
      screenshots,
      covers,
    };

    return game;
  }
}
