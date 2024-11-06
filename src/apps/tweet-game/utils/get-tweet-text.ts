import { OTHER_PLATFORMS_MAX, OTHER_PLATFORMS_MIN } from '@utils/constants';
import { getPlatformName } from 'src/game-source';
import { Game, TweetLang } from 'src/game-source/types';
import { envVars } from './env-vars';

type TranslatedTexts = {
  title: (gameTitle: string) => string;
  description: (text: string) => string;
  otherPlatforms: () => string;
};

const ALL_TEXTS: Record<TweetLang, TranslatedTexts> = {
  [TweetLang.ES]: {
    title: (gameTitle) => `【${gameTitle}】`,
    description: (text) => ` ※ ${text}`,
    otherPlatforms: () => ' ※ Otras plataformas',
  },
  [TweetLang.EN]: {
    title: (gameTitle) => `🕹️ ${gameTitle}`,
    description: (text) => ` 🖼️ ${text}`,
    otherPlatforms: () => ' 🎮 Other platforms',
  },
};

const TEXTS: TranslatedTexts = ALL_TEXTS[envVars.LANG];

export function getTweetText(game: Game, maxChars: number): string {
  const line1 = getTitle(game);
  const line2 = getDescription(game);

  const main = line1 && line2 ? `${line1}\n\n${line2}` : line1 || line2;

  // -1 for the "\n"
  const other = getOtherPlatforms(game, maxChars - main.length - 1);

  return other ? [main, other].join('\n') : main;
}

function getTitle(game: Game): string {
  return TEXTS.title(game.title);
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

  return line ? TEXTS.description(line) : '';
}

function getOtherPlatforms(
  game: Game,
  totalAvailableCharacters: number
): string | undefined {
  /**
   * 2 for the ellipsis (counts like 1 in bsky but 2 in twitter)
   */
  const TEXT_EXTRA_LENGTH = 2;
  const otherPlatformsText = TEXTS.otherPlatforms() + ': ';
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
