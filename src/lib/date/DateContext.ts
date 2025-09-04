import { createContext } from 'react';

interface IDateContext {
  selectedDate: Date;
  setSelectedDate: (newSelectedDate: Date) => void;
}

const DateContext = createContext<IDateContext>({} as IDateContext);

export default DateContext;
