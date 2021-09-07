import { selectRandom } from '@utils/random';
import { Platform } from 'src/interfaces';
import { PLATFORM_NAMES } from './constants';

export class MobyGames {
  public getPlatforms(): Platform[] {
    return Object.keys(PLATFORM_NAMES) as Platform[];
  }

  public getRandomPlatform(): Platform {
    const possiblePlatforms: Platform[] = [
      'amiga',
      'dos',
      'gameboy',
      'gameboy-color',
      'game-gear',
      'nes',
      'pc88',
      'sega-cd',
      'sega-master-system',
      'sega-saturn',
      'snes',
    ];

    return selectRandom(possiblePlatforms)!;
  }
}
