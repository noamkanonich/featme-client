import { addDays, endOfDay, format, startOfDay } from 'date-fns';

import { supabase } from '../lib/supabase/supabase';
import { DailyData } from '../components/cards/DailyBreakdownCard';

type MealRowForHistory = {
  meal_time: string;
  food_items: any[] | null;
  total_calories: number | null;
};

/** Fetch meals for a user within a date range (inclusive day bounds). */
export const fetchMealsForRange = async (
  userId: string,
  rangeStart: Date,
  rangeEnd: Date,
): Promise<MealRowForHistory[]> => {
  const fromIso = startOfDay(rangeStart).toISOString();
  const toIso = endOfDay(rangeEnd).toISOString();

  const { data, error } = await supabase
    .from('meals')
    .select('meal_time, food_items, total_calories')
    .eq('user_id', userId)
    .gte('meal_time', fromIso)
    .lte('meal_time', toIso)
    .order('meal_time', { ascending: true });

  if (error) {
    console.log('fetchMealsForRange error:', error);
    return [];
  }
  return (data ?? []) as MealRowForHistory[];
};

/** Build 7 days starting from `rangeStart`, bucket + aggregate calories & entries. */
export const buildWeekData = (
  rangeStart: Date,
  meals: MealRowForHistory[],
  dailyGoal = 2000,
): DailyData[] => {
  // init bucket for 7 days
  const bucket: Record<string, DailyData> = {};
  for (let i = 0; i < 7; i++) {
    const d = addDays(rangeStart, i);
    const key = format(d, 'yyyy-MM-dd');
    bucket[key] = {
      date: d,
      calories: 0,
      entries: 0,
      caloriesGoal: dailyGoal,
    };
  }

  // aggregate
  meals.forEach(row => {
    const d = new Date(row.meal_time);
    const key = format(d, 'yyyy-MM-dd');
    if (!bucket[key]) return;

    const addCals = Number(row.total_calories ?? 0);
    const addEntries = Array.isArray(row.food_items)
      ? row.food_items.length
      : 0;

    bucket[key].calories += addCals;
    bucket[key].entries += addEntries;
  });

  // back to array in chronological order
  return Object.values(bucket).sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
};

/** One-shot convenience: fetch + build week data. */
export const loadWeekData = async (
  userId: string,
  rangeStart: Date,
  rangeEnd: Date,
  dailyGoal = 2000,
): Promise<DailyData[]> => {
  const rows = await fetchMealsForRange(userId, rangeStart, rangeEnd);
  return buildWeekData(rangeStart, rows, dailyGoal);
};

export const computeWeekStats = (weekData: DailyData[]) => {
  if (!weekData.length) {
    return { totalEntries: 0, avgCalories: 0, daysTracked: 0 };
  }
  const totalEntries = weekData.reduce((acc, d) => acc + (d.entries || 0), 0);
  const daysTracked = weekData.filter(
    d => (d.entries || 0) > 0 || (d.calories || 0) > 0,
  ).length;
  const avgCalories =
    Math.round(
      (weekData.reduce((acc, d) => acc + (d.calories || 0), 0) /
        weekData.length) *
        10,
    ) / 10;

  return { totalEntries, avgCalories, daysTracked };
};
