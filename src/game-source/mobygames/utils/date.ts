import { GameBasicInfoPlatform } from '../db/types';

const REGEX_DATE = /(?<year>\d{4})(-(?<month>\d{1,2})(-(?<day>\d{1,2}))?)?/;

type DateDetails = Pick<GameBasicInfoPlatform, 'year' | 'month' | 'day'>;

export function getDateDetails(strDate?: string): DateDetails | undefined {
  const date = strDate && REGEX_DATE.exec(strDate);
  if (!date) return;

  const year = date.groups!.year;
  if (!year) return;

  const month = date.groups!.month;
  const day = date.groups!.day;

  const info: DateDetails = { year: Number(year) };
  if (month) info.month = Number(month);
  if (day) info.day = Number(day);

  return info;
}
