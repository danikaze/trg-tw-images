import { IMAGES_FRONT_COVER_MIN, IMAGES_MIN } from '@utils/constants';
import { getLogger } from '@utils/logger';
import { CoverArtType, Game } from 'src/game-source/types';

const logger = getLogger('App');

export function gameQualifies(game: Game | undefined): game is Game {
  if (!game) return false;

  const { covers, screenshots } = game;

  // a game without front-cover doesn't qualify
  const frontCoversNum = covers.reduce(
    (acc, group) =>
      acc +
      group.covers.filter((cover) => cover.scanOf === CoverArtType.FRONT_COVER)
        .length,
    0
  );

  if (frontCoversNum < IMAGES_FRONT_COVER_MIN) {
    logger.info(`Game doesn't qualifies: No front-cover found`);
    return false;
  }

  // a game without enough images doesn't qualify either
  if (screenshots.length < IMAGES_MIN - IMAGES_FRONT_COVER_MIN) {
    logger.info(`Game doesn't qualifies: Not enough images`);
    return false;
  }

  return true;
}
