import { default as cheerio, CheerioAPI } from 'cheerio';
import { Element } from 'domhandler';
import { getHref, getInnerText } from '@utils/parser';
import { downloadHtml } from '@utils/download';
import { ImageType } from '.';

export type CoverArtType =
  | 'front-cover'
  | 'back-cover'
  | 'side'
  | 'media'
  | 'manual'
  | 'jewel-case-front'
  | 'jewel-case-back'
  | 'other';

export interface CoverArtInfo {
  url: string;
  type: CoverArtType;
  countries?: string[];
}

export class ImageList {
  protected static ImageSelectorByType: Record<ImageType, string> = {
    screenshot: '#main .row a.thumbnail-image',
    'cover-art': '#main .row a.thumbnail-cover',
    'promo-art': '.thumbnailGallery a',
  };

  protected url: string;
  protected $: CheerioAPI | undefined;

  constructor(url: string) {
    this.url = url;
  }

  public async getImagePageUrls(): Promise<string[] | undefined> {
    const $ = await this.load();
    const pageType = this.getType($);
    if (!pageType) return;

    const selector = ImageList.ImageSelectorByType[pageType];
    const links = Array.from($(selector));
    if (!links) return;
    return links
      .map((a) => getHref(a as Element))
      .filter((link) => !!link) as string[];
  }

  protected async load(): Promise<CheerioAPI> {
    if (this.$) return this.$;

    const html = await downloadHtml(this.url);
    this.$ = cheerio.load(html);
    return this.$;
  }

  protected getCountries($: CheerioAPI): string[] | undefined {
    // $ points to <div.coverHeading>
    const countryTr = Array.from($('tr')).filter((tr) =>
      getInnerText(tr.children[0]).startsWith('Countr')
    )[0];
    if (!countryTr) return;

    return Array.from($('span', countryTr.children[2])).map((span) =>
      getInnerText(span)
    );
  }

  protected getType($: CheerioAPI): ImageType | undefined {
    // $ points to the full page
    const activeTab = $('.nav-tabs li.active')[0];
    if (!activeTab) return;
    const text = getInnerText(activeTab);
    if (text === 'Screenshots') return 'screenshot';
    if (text === 'Cover Art') return 'cover-art';
    if (text === 'Promo Art') return 'promo-art';
  }

  protected getCoverArtType($: CheerioAPI): CoverArtType {
    // $ points to <div.thumbnail>
    const caption = $('.thumbnail-cover-caption')[0];
    const text = getInnerText(caption);
    if (text === 'Front Cover') return 'front-cover';
    if (text === 'Back Cover') return 'back-cover';
    if (text.includes('Spine/Sides')) return 'side';
    if (text.includes('Media')) return 'media';
    if (text.includes('Manual')) return 'manual';
    if (text.includes('Jewel Case - Front')) return 'jewel-case-front';
    if (text.includes('Jewel Case - Back')) return 'jewel-case-back';
    return 'other';
  }
}
