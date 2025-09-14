export interface ICalendarPickerProps {
  date?: Date;
  color: string;
  onChange: (date?: Date) => void;
}
