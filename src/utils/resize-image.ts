import { statSync } from 'fs';
import { extname } from 'path';
import { default as sharp } from 'sharp';
import { withoutExtension } from './without-extension';

export interface ResizeImageOptions {
  /** Path to the file containing the image */
  imagePath: string;
  /** Output format */
  format?: 'jpeg' | 'png' | 'webp';
  /** Maximum size in bytes */
  maxSize?: number;
  /** When resizing, how many pixels to reduce each time (on the longest side) */
  decrementStepPx?: number;
}

export interface ResizeImageResult {
  /** Resulting width after the resize */
  width: number;
  /** Resulting height after the resize */
  height: number;
  /** Size in bytes */
  size: number;
  /** Path to the new image */
  path: string;
}

const DEFAULT_OPTIONS = {
  format: 'jpeg',
  maxSize: Infinity,
  decrementStepPx: 10,
} as const;

export async function resizeImage(
  options: ResizeImageOptions
): Promise<ResizeImageResult> {
  const { imagePath, format, maxSize, decrementStepPx } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const process = sharp(imagePath);
  const metadata = await process.metadata();
  let path = imagePath;
  let size = statSync(path).size;
  let width = metadata.width!;
  let height = metadata.height!;

  while (size > maxSize) {
    const newSize = getNewSize(width, height, decrementStepPx);
    width = newSize.width;
    height = newSize.height;
    const resized = process.clone().resize(width, height, { fit: 'contain' });
    path = `${withoutExtension(imagePath)}-${width}x${height}${extname(
      imagePath
    )}`;
    await resized[format]().toFile(path);
    size = statSync(path).size;
  }

  return {
    width,
    height,
    size,
    path,
  };
}

function getNewSize(
  width: number,
  height: number,
  step: number
): { width: number; height: number } {
  const ratio = width / height;
  return ratio > 1
    ? {
        width: width - step,
        height: Math.round((width - step) / ratio),
      }
    : {
        width: Math.round((height - step) * ratio),
        height: height - step,
      };
}
