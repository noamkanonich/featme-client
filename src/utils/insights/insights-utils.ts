// src/utils/insights-utils.ts
import { startOfDay, endOfDay, addDays, format } from 'date-fns';
import { supabase } from '../../lib/supabase/supabase';

export type DailyNutrition = {
  date: Date;
  calories: number;
  protein: number; // grams
  fat: number; // grams
  carbs: number; // grams
  entries: number; // number of food items
};

export type RangeStats = {
  daily: DailyNutrition[];
  avgCalories: number;
  avgProtein: number;
  avgFat: number;
  avgCarbs: number;
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
};

type MealRow = { id: string; meal_time: string };
type MealItemRow = {
  meal_id: string;
  calories?: number | null;
  protein?: number | null;
  fat?: number | null;
  carbs?: number | null;
};

/**
 * Schema:
 * - meals(id, user_id, meal_time)
 * - meal_items(meal_id, calories, protein, fat, carbs, ...)
 */
export const getNutritionRange = async (
  userId: string,
  start: Date,
  end: Date,
): Promise<RangeStats> => {
  const fromIso = startOfDay(start).toISOString();
  const toIso = endOfDay(end).toISOString();

  // 1) Fetch meals in range
  const { data: meals, error: mealsError } = await supabase
    .from('meals')
    .select('id, meal_time')
    .eq('user_id', userId)
    .gte('meal_time', fromIso)
    .lte('meal_time', toIso);

  if (mealsError) throw mealsError;

  // Seed days
  const days: Record<string, DailyNutrition> = {};
  const dayCount = Math.max(
    1,
    Math.ceil(
      (endOfDay(end).getTime() - startOfDay(start).getTime()) / 86400000,
    ) + 1,
  );

  for (let i = 0; i < dayCount; i++) {
    const d = addDays(startOfDay(start), i);
    const key = format(d, 'yyyy-MM-dd');
    days[key] = {
      date: d,
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      entries: 0,
    };
  }

  if (!meals || meals.length === 0) {
    return buildStatsFromDays(Object.values(days));
  }

  // Map meal_id -> meal_time
  const mealIdToDate = new Map<string, Date>();
  const mealIds: string[] = [];
  for (const m of meals as MealRow[]) {
    if (!m?.id) continue;
    mealIds.push(m.id);
    mealIdToDate.set(m.id, new Date(m.meal_time));
  }

  // 2) Fetch items for those meals
  const { data: items, error: itemsError } = await supabase
    .from('meal_items')
    .select('meal_id, calories, protein, fat, carbs')
    .in('meal_id', mealIds);

  if (itemsError) throw itemsError;

  // 3) Aggregate into day buckets
  for (const it of (items ?? []) as MealItemRow[]) {
    const mealDate = mealIdToDate.get(it.meal_id);
    if (!mealDate) continue;
    const key = format(mealDate, 'yyyy-MM-dd');
    const bucket = days[key];
    if (!bucket) continue;

    bucket.calories += toNum(it.calories);
    bucket.protein += toNum(it.protein);
    bucket.fat += toNum(it.fat);
    bucket.carbs += toNum(it.carbs);
    bucket.entries += 1;
  }

  const daily = Object.values(days).sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  return buildStatsFromDays(daily);
};

const buildStatsFromDays = (daily: DailyNutrition[]): RangeStats => {
  const totalCalories = sum(daily.map(d => d.calories));
  const totalProtein = sum(daily.map(d => d.protein));
  const totalFat = sum(daily.map(d => d.fat));
  const totalCarbs = sum(daily.map(d => d.carbs));

  const n = daily.length || 1;
  const avgCalories = Math.round(totalCalories / n);
  const avgProtein = Math.round(totalProtein / n);
  const avgFat = Math.round(totalFat / n);
  const avgCarbs = Math.round(totalCarbs / n);

  return {
    daily,
    avgCalories,
    avgProtein,
    avgFat,
    avgCarbs,
    totalCalories,
    totalProtein,
    totalFat,
    totalCarbs,
  };
};

const sum = (arr: number[]) =>
  arr.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);

const toNum = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Convert macro grams → kcal distribution */
export const gramsToKcalDistribution = (g: {
  protein: number;
  fat: number;
  carbs: number;
}) => ({
  proteinKcal: g.protein * 4,
  fatKcal: g.fat * 9,
  carbsKcal: g.carbs * 4,
});
