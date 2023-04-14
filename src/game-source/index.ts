import { GameSource, GameSourceStatic } from './base';
import { MobyGamesGameSource } from './mobygames';
import { GameSourceType, PlatformType } from './types';
import { PLATFORM_NAMES } from './constants/platform';

export function getGameSource(type: GameSourceType): GameSource {
  const availableGameSourceConstructors: Record<
    GameSourceType,
    GameSourceStatic
  > = {
    mobygames: MobyGamesGameSource,
  };

  const Source = availableGameSourceConstructors[type];
  if (!Source) {
    throw new Error(`Unknown GameSource "${type}"`);
  }

  return new Source();
}

export function getPlatformName(type: PlatformType): string {
  return PLATFORM_NAMES[type];
}
