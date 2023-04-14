import { Game, GameSourceType, PlatformType } from '../types';

export interface GetRandomGameOptions {
  gameId?: number | string;
  minYear?: number;
  maxYear?: number;
  platforms?: PlatformType[];
}

export interface GameSourceStatic {
  new (): GameSource;
}

export abstract class GameSource {
  public readonly name: GameSourceType;

  constructor(name: GameSourceType) {
    this.name = name;
  }

  public getGame(
    gameId: Game['id'],
    platforms?: PlatformType[]
  ): Promise<Game | undefined> {
    return this.getRandomGame({
      gameId,
      platforms,
    });
  }

  public abstract getRandomGame(
    options?: GetRandomGameOptions
  ): Promise<Game | undefined>;
}
