import {
  addMinutes,
  addMonths,
  addWeeks,
  format as dateFnsFormat,
} from 'date-fns';
import {NativeModules, Platform} from 'react-native';

const getLocale = () => {
  if (Platform.OS === 'web') {
    return navigator.language;
  }

  let locale;
  switch (Platform.OS) {
    case 'ios':
      locale =
        NativeModules.SettingsManager.settings.AppleLanguages[0] ||
        NativeModules.SettingsManager.settings.AppleLocale;
      break;

    case 'android':
      locale = NativeModules.I18nManager.localeIdentifier;
      break;
    default:
      throw new Error(`Platform not supported: ${Platform.OS}`);
  }
  locale = locale.replace('_', '-').replace('iw', 'he').replace('UK', 'GB');
  if (locale === 'en-GB' || locale === 'en-US') {
    return locale;
  }
  if (/^[a-z]{2}-([a-zA-Z]+)$/.test(locale)) {
    return locale.substring(0, 2);
  }

  return undefined;
};

export const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat(getLocale(), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h24',
  }).format(date);
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat(getLocale(), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

export const getDayNames = (
  locale = 'en',
  format: 'short' | 'long' | 'narrow' = 'short',
) => {
  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: format,
    timeZone: 'UTC',
  });
  return [1, 2, 3, 4, 5, 6, 7].map(day => {
    const dd = day < 10 ? `0${day}` : day;
    return formatter.format(new Date(`2017-01-${dd}T00:00:00+00:00`));
  });
};

export const getMonthNames = (
  locale = 'en',
  format: 'short' | 'long' | 'narrow' = 'short',
) => {
  const formatter = new Intl.DateTimeFormat(locale, {
    month: format,
    timeZone: 'UTC',
  });
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => {
    const mm = month < 10 ? `0${month}` : month;
    return formatter.format(new Date(`2017-${mm}-01T00:00:00+00:00`));
  });
};

export const getMonthName = (
  date: Date,
  locale = 'en',
  format: 'short' | 'long' | 'narrow' = 'short',
) => {
  return new Intl.DateTimeFormat(locale, {
    month: format,
    timeZone: 'UTC',
  }).format(date);
};

export const getShortDayName = (date: Date, locale = 'en') => {
  return new Intl.DateTimeFormat(locale, {
    weekday: locale === 'he' ? 'narrow' : 'short',
  }).format(date);
};

export const formatLongDate = (date: Date, locale = 'en') => {
  const monthName = getMonthName(date, locale, 'short');
  return `${dateFnsFormat(date, `dd '${monthName}' yyyy`)}`;
};

export const fromLocalToUtc = (date: Date) =>
  addMinutes(date, -date.getTimezoneOffset());

export const agnosticAddMonths = (date: Date, amount: number) => {
  const originalTimezoneOffset = date.getTimezoneOffset();
  const endDate = addMonths(date, amount);
  const endTimezoneOffset = endDate.getTimezoneOffset();

  const diff = originalTimezoneOffset - endTimezoneOffset;

  return diff ? addMinutes(endDate, diff) : endDate;
};

export const agnosticAddWeeks = (date: Date, amount: number) => {
  const originalTimezoneOffset = date.getTimezoneOffset();
  const endDate = addWeeks(date, amount);
  const endTimezoneOffset = endDate.getTimezoneOffset();

  const diff = originalTimezoneOffset - endTimezoneOffset;

  return diff ? addMinutes(endDate, diff) : endDate;
};
