import { CoverArtType } from 'src/game-source/types';

const COVER_ART: Record<string, CoverArtType> = {
  'Front Cover': CoverArtType.FRONT_COVER,
  'Back Cover': CoverArtType.BACK_COVER,
  'Inside Cover': CoverArtType.INSIDE_COVER,
  Media: CoverArtType.MEDIA,
  Other: CoverArtType.OTHER,
  'Spine/Sides': CoverArtType.SPINE_SIDE,
  Manual: CoverArtType.MANUAL,
  'Reference Card': CoverArtType.REFERENCE_CARD,
  Extras: CoverArtType.EXTRAS,
  'Jewel Case - Front': CoverArtType.JEWEL_CASE_FRONT,
  'Jewel Case - Back': CoverArtType.JEWEL_CASE_BACK,
};

export function getCoverArtType(scanOf: string): CoverArtType {
  return COVER_ART[scanOf] || CoverArtType.OTHER;
}
