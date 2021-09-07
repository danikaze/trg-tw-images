import { default as cheerio, CheerioAPI } from 'cheerio';
import { downloadHtml, downloadImage } from '@utils/download';
import { getInnerText } from '@utils/parser';
import { getTempFilePath } from '@utils/get-temp-file-path';
import { getLogger } from '@utils/logger';
import { ImageType } from '.';

export interface ImageInfo {
  url: string;
  filePath: string;
  type?: ImageType;
  alt?: string;
}

export function imageInfoSorter(a: ImageInfo, b: ImageInfo): number {
  let ia = IMAGE_TYPE_ORDER.indexOf(a.type!);
  if (ia === -1) {
    ia = IMAGE_TYPE_ORDER.length;
  }

  let ib = IMAGE_TYPE_ORDER.indexOf(b.type!);
  if (ib === -1) {
    ib = IMAGE_TYPE_ORDER.length;
  }

  return ia - ib;
}

const IMAGE_TYPE_ORDER: ImageType[] = ['cover-art', 'promo-art', 'screenshot'];
const logger = getLogger('Image');

export class Image {
  protected url: string;

  constructor(url: string) {
    this.url = url;
  }

  public async downloadImage(): Promise<ImageInfo | undefined> {
    const $ = await this.load();
    const img = $('.img-responsive')[0];
    if (!img) return;
    const filePath = getTempFilePath(img.attribs.src);
    const data = {
      filePath,
      type: this.getType($),
      url: 'https://www.mobygames.com' + img.attribs.src,
      alt: img.attribs.alt,
    };

    logger.info(`Downloading ${data.type} from ${this.url}`);
    try {
      await downloadImage(data.url, filePath);
      return data;
    } catch (error) {
      logger.error(`Error while downloading: ${error}`);
    }
  }

  protected async load(): Promise<CheerioAPI> {
    const html = await downloadHtml(this.url);
    const $ = cheerio.load(html);
    // load the page without ads
    $('.lifesupport-header').remove();

    return $;
  }

  protected getType($: CheerioAPI): ImageType | undefined {
    const activeTab = $('.nav-tabs li.active')[0];
    if (!activeTab) return;
    const text = getInnerText(activeTab);
    if (text === 'Screenshots') return 'screenshot';
    if (text === 'Cover Art') return 'cover-art';
    if (text === 'Promo Art') return 'promo-art';
  }
}
