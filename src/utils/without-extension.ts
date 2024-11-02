import { extname } from 'path';

export function withoutExtension(filePath: string): string {
  const ext = extname(filePath);
  return filePath.substring(0, filePath.length - ext.length);
}
