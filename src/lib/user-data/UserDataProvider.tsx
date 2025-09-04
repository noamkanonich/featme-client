// src/lib/user-data/UserDataProvider.tsx
import React, { ReactNode, useEffect, useState, useCallback } from 'react';
import useAuth from '../auth/useAuth';
import { IUserGoals } from '../../data/IUserGoals';
import { IMeal } from '../../data/meals/IMeal';
import { IUserSettings } from '../../data/IUserSettings';
import UserDataContext from './UserDataContext';
import { ensureMealForDate, getMealsByDate } from '../../utils/meals-utils';
import { MealType } from '../../data/meals/MealType';
import { getUserGoalsByUserId } from '../../utils/user-goals-utils';
import { getUserSettingsByUserId } from '../../utils/user-settings-utils';
import useDate from '../date/useDate';
import axios from 'axios';

interface Props {
  children: ReactNode;
}

export const UserDataProvider = ({ children }: Props) => {
  const { selectedDate } = useDate();
  const { user } = useAuth();
  const [userMeals, setUserMeals] = useState<IMeal[] | undefined>(undefined);
  const [userGoals, setUserGoals] = useState<IUserGoals | undefined>(undefined);
  const [userSettings, setUserSettings] = useState<IUserSettings | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);

  const refreshData = useCallback(async () => {
    console.log('REFRESH DATA');
    if (!user) return;
    setLoading(true);
    try {
      const [goalsRes, settingsRes, mealsRes] = await Promise.all([
        getUserGoalsByUserId(user.id),
        getUserSettingsByUserId(user.id),
        getMealsByDate(user.id, selectedDate),
      ]);

      if (goalsRes) setUserGoals(goalsRes);
      if (settingsRes) setUserSettings(settingsRes);
      if (mealsRes) setUserMeals(mealsRes);
    } catch (err) {
      console.error('Error refreshing user data:', err);
    } finally {
      setLoading(false);
    }
  }, [user, selectedDate]);

  useEffect(() => {
    if (!user) return;

    (async () => {
      console.log('ENSURE MEALS FOR DATE:', selectedDate);
      try {
        await Promise.all([
          ensureMealForDate(user.id, MealType.Breakfast, selectedDate),
          ensureMealForDate(user.id, MealType.Lunch, selectedDate),
          ensureMealForDate(user.id, MealType.Dinner, selectedDate),
          ensureMealForDate(user.id, MealType.Snack, selectedDate),
        ]);
      } catch (e) {
        console.error('ensure meals failed:', e);
      } finally {
        await refreshData();
      }
    })();
  }, [user, selectedDate, refreshData]);

  useEffect(() => {
    if (user) refreshData();
  }, [user, refreshData]);

  const updateUserSettings = useCallback(
    async (patch: Partial<IUserSettings>) => {
      if (!user) return;

      setUserSettings(prev =>
        prev
          ? ({ ...prev, ...patch } as IUserSettings)
          : ({ ...patch, userId: user.id } as IUserSettings),
      );
      try {
        await axios.put('/me/settings', patch);

        // await upsertUserSettings({
        //   ...(userSettings ?? {}),
        //   ...patch,
        //   userId: user.id,
        // });
      } catch (e) {
        console.error('updateUserSettings failed:', e);
        await refreshData();
      }
    },
    [user, refreshData],
  );

  const updateUserGoals = useCallback(
    async (patch: Partial<IUserGoals>) => {
      if (!user) return;

      setUserGoals(prev =>
        prev
          ? ({ ...prev, ...patch } as IUserGoals)
          : ({ ...patch, userId: user.id } as IUserGoals),
      );

      try {
        console.log(patch);
        await axios.put('/me/goals', patch);
        // await updateUserGoalsByUserId(user.id, userGoalsPatchToRow(patch));
      } catch (e) {
        console.error('updateUserGoals failed:', e);
        await refreshData();
      }
    },
    [user, refreshData],
  );

  return (
    <UserDataContext.Provider
      value={{
        meals: userMeals ?? null,
        userGoals: userGoals ?? null,
        userSettings: userSettings ?? null,
        setMeals: setUserMeals as (m: IMeal[]) => void,
        setUserGoals: setUserGoals as (g: IUserGoals) => void,
        setUserSettings: setUserSettings as (s: IUserSettings) => void,
        loading,
        refreshData,
        updateUserSettings,
        updateUserGoals,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};
