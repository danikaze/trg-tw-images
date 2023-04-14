import { extname, join } from 'path';
import { envVars } from 'src/apps/tweet-game/utils/env-vars';

export function getTempFilePath(
  from: string,
  date?: number,
  i?: number
): string {
  /* eslint-disable no-magic-numbers */
  const ext = extname(from);
  const filename = [
    String(date || Date.now()).substring(6),
    i !== undefined ? `${i}` : '',
    String(Math.random()).substring(2, 5),
  ]
    .filter(Boolean)
    .join('.');

  return join(envVars.PATH_TEMP_FOLDER, `${filename}${ext}`);
}
