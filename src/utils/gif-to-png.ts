import { default as sharp } from 'sharp';

export async function gif2png(filePath: string): Promise<string> {
  const targetFile = withoutExtension(filePath) + '.png';

  await sharp(filePath).png().toFile(targetFile);
  return targetFile;
}

function withoutExtension(filePath: string): string {
  const index = filePath.lastIndexOf('.');
  return filePath.substring(0, index);
}
