declare module 'react-native-modern-datepicker' {
  import * as React from 'react';

  export interface DatePickerProps {
    onSelectedChange: (date: string) => void;
    options: {
      defaultFont?: string;
      headerFont?: string;
      backgroundColor?: string;
      textHeaderColor?: string;
      textDefaultColor?: string;
      selectedTextColor?: string;
      mainColor?: string;
      textSecondaryColor?: string;
      borderColor?: string;
    };
    selected?: string | number;
    mode?: string;
    minuteInterval?: number;
    configs: {
      dayNames: string[];
      dayNamesShort: string[];
      monthNames: string[];
    };
  }

  export class DatePicker extends React.Component<DatePickerProps> {}

  export default DatePicker;
}
