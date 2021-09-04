import { extname, join } from 'path';
import { PATH } from './constants';

export function getTempFilePath(from: string): string {
  const ext = extname(from);
  return join(
    PATH.TEMP_FOLDER,
    // eslint-disable-next-line no-magic-numbers
    `${Date.now()}.${String(Math.random()).substr(2, 8)}${ext}`
  );
}
