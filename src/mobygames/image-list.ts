import { Node } from 'domhandler';
import { default as cheerio, CheerioAPI } from 'cheerio';
import { getHref, getInnerText } from '@utils/parser';
import { downloadHtml } from '@utils/download';
import { ImageType, CoverArtType, ThumbnailInfo } from 'src/interfaces';

export class ImageList {
  protected static ImageSelectorByType: Record<ImageType, string> = {
    screenshot: '#main .row .thumbnail',
    'cover-art': '#main .row .thumbnail',
    'promo-art': '.thumbnailGallery figure',
  };

  protected static CaptionSelectorByType: Record<ImageType, string> = {
    screenshot: '.thumbnail-caption',
    'cover-art': '.thumbnail-cover-caption',
    'promo-art': 'figcaption',
  };

  protected url: string;
  protected $: CheerioAPI | undefined;

  constructor(url: string) {
    this.url = url;
  }

  public async getImagePageUrls(): Promise<ThumbnailInfo[] | undefined> {
    const $ = await this.load();
    const pageType = this.getType($);
    if (!pageType) return;

    const selector = ImageList.ImageSelectorByType[pageType];
    const thumbs = Array.from($(selector));
    if (!thumbs) return;

    return thumbs
      .map((thumb) => {
        const link = $('a', thumb)[0];
        if (!link) return;
        const url = getHref(link);
        if (!url) return;
        const coverArtType =
          pageType === 'cover-art' ? this.getCoverArtType($, thumb) : undefined;
        const alt = this.getCaption($, thumb, pageType);

        return {
          url,
          coverArtType,
          alt,
          type: pageType,
        } as ThumbnailInfo;
      })
      .filter((thumb) => !!thumb) as ThumbnailInfo[];
  }

  protected async load(): Promise<CheerioAPI> {
    if (this.$) return this.$;

    const html = await downloadHtml(this.url);
    this.$ = cheerio.load(html);
    return this.$;
  }

  protected getType($: CheerioAPI): ImageType | undefined {
    const activeTab = $('.nav-tabs li.active')[0];
    if (!activeTab) return;
    const text = getInnerText(activeTab);
    if (text === 'Screenshots') return 'screenshot';
    if (text === 'Cover Art') return 'cover-art';
    if (text === 'Promo Art') return 'promo-art';
  }

  protected getCountries($: CheerioAPI, context: Node): string[] | undefined {
    const countryTr = Array.from($('tr')).filter((tr) =>
      getInnerText(tr.children[0]).startsWith('Countr')
    )[0];
    if (!countryTr) return;

    return Array.from($('span', countryTr.children[2])).map((span) =>
      getInnerText(span)
    );
  }

  protected getCaption(
    $: CheerioAPI,
    context: Node,
    type: ImageType
  ): string | undefined {
    const selector = ImageList.CaptionSelectorByType[type];
    const caption = $(selector, context)[0];
    if (!caption) return;
    return getInnerText(caption).trim();
  }

  protected getCoverArtType($: CheerioAPI, context: Node): CoverArtType {
    const caption = $('.thumbnail-cover-caption', context)[0];
    const text = (getInnerText(caption) || '').trim();
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
