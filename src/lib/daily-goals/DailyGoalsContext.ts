import React, { createContext } from 'react';
import { IDailyGoals } from '../../data/IDailyGoals';

interface IDailyGoalsContext {
  dailyGoals: IDailyGoals;
  setDailyGoals: (goals: IDailyGoals) => void;
}

const DailyGoalsContext = createContext<IDailyGoalsContext>(
  {} as IDailyGoalsContext,
);

export default DailyGoalsContext;
