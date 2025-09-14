import {CalendarDigit} from '@hassanmojab/react-modern-calendar-datepicker';

export const defaults = {
  weekStartingIndex: 0,
  getToday(gregorianTodayObject: {year: number; month: number; day: number}) {
    return gregorianTodayObject;
  },
  toNativeDate(date: {year: number; month: number; day: number}) {
    return new Date(date.year, date.month - 1, date.day);
  },
  getMonthLength(date: {year: number; month: number}) {
    return new Date(date.year, date.month, 0).getDate();
  },
  transformDigit(digit: CalendarDigit) {
    return digit;
  },
  nextMonth: 'Next Month',
  previousMonth: 'Previous Month',
  openMonthSelector: 'Open Month Selector',
  openYearSelector: 'Open Year Selector',
  closeMonthSelector: 'Close Month Selector',
  closeYearSelector: 'Close Year Selector',
  from: 'from',
  to: 'to',
  defaultPlaceholder: 'Select...',
  digitSeparator: ',',
  yearLetterSkip: 0,
};
