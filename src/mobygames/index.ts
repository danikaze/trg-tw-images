import { selectRandom } from '@utils/random';
import { PLATFORM_NAMES } from './constants';

export type Platform = keyof typeof PLATFORM_NAMES;

export type ImageType = 'screenshot' | 'cover-art' | 'promo-art';

export class MobyGames {
  public getPlatforms(): Platform[] {
    return Object.keys(PLATFORM_NAMES) as Platform[];
  }

  public getRandomPlatform(): Platform {
    const possiblePlatforms: Platform[] = [
      'amiga',
      'dos',
      'gameboy',
      'gameboy-advance',
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
