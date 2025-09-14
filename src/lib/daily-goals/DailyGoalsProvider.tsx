import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { IDailyGoals } from '../../data/IDailyGoals';
import DailyGoalsContext from './DailyGoalsContext';
import useAuth from '../auth/useAuth';
import { getUserGoalsByUserId } from '../../utils/user-goals/user-goals-utils';

interface DailyGoalsProviderProps {
  children: ReactNode;
}

export const DailyGoalsProvider = ({ children }: DailyGoalsProviderProps) => {
  const { user } = useAuth();
  const [dailyGoals, setDailyGoals] = useState<IDailyGoals | undefined>(
    undefined,
  );

  useEffect(() => {
    const getDailyGoals = async () => {
      try {
        console.log('USER ID FOR DAILY GOALS: ', user?.id);
        const { data: userGoals, error } = await getUserGoalsByUserId(user!.id);
        if (error) {
          console.error('Error fetching user goals:', error);
          return;
        }
        if (userGoals) {
          console.log('USER GOALS PROVIDER: ', dailyGoals);
          setDailyGoals(userGoals);
        } else {
          console.warn('No daily goals found for the user.');
        }
      } catch (err) {
        console.error('Error fetching daily goals:', err);
      }
    };

    if (user) {
      getDailyGoals();
    }
  }, [user, dailyGoals]);

  const updateDailyGoals = useCallback(async () => {}, []);

  return (
    <DailyGoalsContext.Provider
      value={{
        dailyGoals,
        setDailyGoals: (goals: IDailyGoals) => {
          setDailyGoals(goals);
          updateDailyGoals();
        },
        updateDailyGoals: updateDailyGoals,
      }}
    >
      {children}
    </DailyGoalsContext.Provider>
  );
};
