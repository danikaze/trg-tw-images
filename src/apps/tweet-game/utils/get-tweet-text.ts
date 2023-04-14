import {
  OTHER_PLATFORMS_MAX,
  OTHER_PLATFORMS_MIN,
  TWEET_MAX_LENGTH,
} from '@utils/constants';
import { getPlatformName } from 'src/game-source';
import { Game } from 'src/game-source/types';

export function getTweetText(game: Game): string {
  const line1 = getTitle(game);
  const line2 = getDescription(game);

  const main = [line1, '\n', line2].filter((line) => !!line).join('\n');

  // -1 for the "\n"
  const other = getOtherPlatforms(game, TWEET_MAX_LENGTH - main.length - 1);

  return other ? [main, other].join('\n') : main;
}

function getTitle(game: Game): string {
  return `【${game.title}】`;
}

function getDescription(game: Game): string {
  const gameYear = game.year && String(game.year);
  const gamePlatform = getPlatformName(game.platform);

  const line =
    !gameYear && !gamePlatform
      ? ''
      : gameYear && gamePlatform
      ? `${gamePlatform} (${gameYear})`
      : gameYear || gamePlatform;

  return line ? ` ※ ${line}` : '';
}

function getOtherPlatforms(
  game: Game,
  totalAvailableCharacters: number
): string | undefined {
  /**
   * 1 for the new line
   * 2 for ellipsis
   * 1 extra for each 【】 in the title
   * 1 extra for each ※
   */
  const TEXT_EXTRA_LENGTH = 7;
  const otherPlatformsText = ' ※ Otras plataformas: ';
  const otherPlatforms: string[] = [];
  const separator = ', ';

  let availableCharacters =
    totalAvailableCharacters - otherPlatformsText.length - TEXT_EXTRA_LENGTH;

  for (const platform of game.otherPlatforms) {
    const platformName = getPlatformName(platform);
    if (availableCharacters > platformName.length) {
      otherPlatforms.push(platformName);
      availableCharacters -= platformName.length + separator.length;
      if (
        OTHER_PLATFORMS_MAX > 0 &&
        otherPlatforms.length >= OTHER_PLATFORMS_MAX
      ) {
        break;
      }
    }
  }

  if (otherPlatforms.length < OTHER_PLATFORMS_MIN) return;

  return (
    otherPlatformsText +
    otherPlatforms.join(separator) +
    (otherPlatforms.length < game.otherPlatforms.length ? '…' : '')
  );
}
