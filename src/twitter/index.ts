import { extname } from 'path';
import { ImageInfo } from 'src/mobygames/image';
import { IMAGES_NO_EXT } from '@utils/constants';

export async function tweetImage(
  text: string,
  images: ImageInfo[]
): Promise<void> {
  const imageList =
    images.length <= 1
      ? images
      : images.filter(
          (image) => !IMAGES_NO_EXT.includes(extname(image.filePath))
        );
}
