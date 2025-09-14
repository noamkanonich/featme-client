import React, {useCallback, useMemo} from 'react';
import {
  Calendar,
  DayValue,
  Locale,
} from '@hassanmojab/react-modern-calendar-datepicker';

import {ICalendarPickerProps} from './ICalendarPickerProps';

import {defaults} from './consts';
import './Calendar.css';
import i18n from '../../i18n';
import {getDayNames, getMonthNames} from '../../utils/calendar/calendar-utils';

const CalendarPicker = ({date, color, onChange}: ICalendarPickerProps) => {
  const parsedDate = useMemo(() => {
    if (!date) {
      return null;
    }
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  }, [date]);

  const handleChange = useCallback(
    (newDate: DayValue) => {
      onChange(
        newDate
          ? new Date(Date.UTC(newDate.year, newDate.month - 1, newDate.day))
          : undefined,
      );
    },
    [onChange],
  );

  const calendarLocale: Locale = useMemo(() => {
    const weekdaysLong = getDayNames(i18n.language, 'long');
    const weekdaysShort = getDayNames(i18n.language, 'narrow');

    return {
      ...defaults,
      months: getMonthNames(i18n.language, 'long'),
      weekDays: [0, 1, 2, 3, 4, 5, 6].map(i => ({
        name: weekdaysLong[i],
        short: weekdaysShort[i],
        isWeekend: i === 6,
      })),
      isRtl: i18n.dir() === 'rtl',
    };
  }, []);

  return (
    <Calendar
      value={parsedDate}
      onChange={handleChange}
      colorPrimary={color}
      locale={calendarLocale}
    />
  );
};

export default CalendarPicker;
