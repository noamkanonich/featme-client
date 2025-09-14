import React, { useCallback } from 'react';
import DatePicker from 'react-native-modern-datepicker';
import { format, parse } from 'date-fns';
import i18n from '../../i18n';
import { Dark, White } from '../../theme/colors';
import { ICalendarPickerProps } from './ICalendarPickerProps';
import {
  getDayNames,
  getMonthNames,
} from '../../utils/calendar/calendar-utils';

const CalendarPicker = ({ date, color, onChange }: ICalendarPickerProps) => {
  const handleSelectedChange = useCallback(
    (newDate: string) => {
      console.log('DSASAS');
      const parsedDate = parse(newDate, 'yyyy/MM/dd', new Date());
      console.log(parsedDate);
      onChange(parsedDate);
    },
    [onChange],
  );

  return (
    <DatePicker
      onSelectedChange={handleSelectedChange}
      options={{
        defaultFont: 'Circular20-Medium',
        headerFont: 'Circular20-Medium',
        backgroundColor: White,
        textHeaderColor: Dark,
        textDefaultColor: Dark,
        selectedTextColor: White,
        mainColor: color,
        textSecondaryColor: Dark,
        borderColor: 'white',
      }}
      // current={format(date!, 'yyyy-MM-dd')}
      current={date ? format(date, 'yyyy/MM/dd') : undefined}
      selected={format(date!, 'yyyy-MM-dd')}
      mode="calendar"
      minuteInterval={30}
      configs={{
        dayNames: getDayNames(i18n.language, 'short'),
        dayNamesShort: getDayNames(i18n.language, 'short'),
        monthNames: getMonthNames(i18n.language),
      }}
    />
  );
};

export default CalendarPicker;
