import { default as sharp } from 'sharp';

export function gif2png(filePath: string): Promise<string> {
  const targetFile = withoutExtension(filePath) + '.png';

  return sharp(filePath)
    .png()
    .toFile(targetFile)
    .then(() => targetFile)
    .catch((error) => {
      throw new Error(error);
    });
}

function withoutExtension(filePath: string): string {
  const index = filePath.lastIndexOf('.');
  return filePath.substr(0, index);
}
