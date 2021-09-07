import axios, { AxiosRequestConfig } from 'axios';
import { createWriteStream } from 'fs';
import { sync as mkdirp } from 'mkdirp';
import { dirname, resolve } from 'path';
import { getLogger } from './logger';

const logger = getLogger('download');

const htmlCache: Record<string, string> = {};

export async function downloadImage(
  url: string,
  outputPath: string,
  options?: AxiosRequestConfig
): Promise<void> {
  const filePath = resolve(outputPath);
  logger.debug(`Downloading image from ${url} to ${filePath}`);
  mkdirp(dirname(filePath));
  const writer = createWriteStream(filePath);
  const res = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    ...options,
  });
  res.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

export async function downloadHtml(url: string): Promise<string> {
  const cached = htmlCache[url];
  if (cached) return cached;

  try {
    logger.debug(`Downloading html from ${url}`);
    const res = await axios({
      url,
      method: 'GET',
      responseType: 'text',
    });
    htmlCache[url] = res.data;
    return res.data;
  } catch (error) {
    throw new Error(`downloadHtml: ${error}`);
  }
}
