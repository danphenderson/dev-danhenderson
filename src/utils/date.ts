const ISO_CALENDAR_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

const parseIsoCalendarDate = (value: string): Date | null => {
  const match = ISO_CALENDAR_DATE_REGEX.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utcDate = new Date(Date.UTC(year, month - 1, day));

  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== month - 1 ||
    utcDate.getUTCDate() !== day
  ) {
    return null;
  }

  return utcDate;
};

export const getIsoDateUtcTimestamp = (value?: string | null): number => {
  if (!value) return 0;
  const utcDate = parseIsoCalendarDate(value);
  return utcDate ? utcDate.getTime() : 0;
};

export const formatIsoDateAsUtcCalendar = (value?: string | null): string => {
  if (!value) return '';

  const utcDate = parseIsoCalendarDate(value);
  if (!utcDate) return value;

  return new Intl.DateTimeFormat(undefined, {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(utcDate);
};
