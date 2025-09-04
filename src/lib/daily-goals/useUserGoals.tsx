import { useContext } from 'react';
import DailyGoalsContext from './DailyGoalsContext';

const useDailyGoals = () => useContext(DailyGoalsContext);
export default useDailyGoals;
