import React, { ReactNode, useState } from 'react';
import useAuth from '../auth/useAuth';
import DateContext from './DateContext';

interface DateProviderProps {
  children: ReactNode;
}

export const DateProvider = ({ children }: DateProviderProps) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <DateContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};
