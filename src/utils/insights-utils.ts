// src/utils/insights-utils.ts
import { startOfDay, endOfDay, addDays, format } from 'date-fns';
import { supabase } from '../lib/supabase/supabase';

export type DailyNutrition = {
  date: Date;
  calories: number;
  protein: number; // grams
  fat: number; // grams
  carbs: number; // grams
  entries: number; // number of food items
};

export type RangeStats = {
  daily: DailyNutrition[]; // 7 or 30 points
  avgCalories: number;
  avgProtein: number;
  avgFat: number;
  avgCarbs: number;
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
};

/**
 * Fetch all meals (and their food_items) for a user in [start, end],
 * and aggregate per calendar day: calories, protein, fat, carbs.
 *
 * Assumptions:
 * - Table: public.meals
 * - Columns: user_id (uuid), meal_time (timestamptz), food_items (jsonb array)
 * - Each food item has numeric fields: calories, protein, fat, carbs
 */
export async function getNutritionRange(
  userId: string,
  start: Date,
  end: Date,
): Promise<RangeStats> {
  const fromIso = startOfDay(start).toISOString();
  const toIso = endOfDay(end).toISOString();

  const { data, error } = await supabase
    .from('meals')
    .select('meal_time, food_items')
    .eq('user_id', userId)
    .gte('meal_time', fromIso)
    .lte('meal_time', toIso);

  if (error) throw error;

  // Seed a map for each day in range with zeros
  const days: Record<string, DailyNutrition> = {};
  const daysCount = Math.max(
    1,
    Math.ceil(
      (endOfDay(end).getTime() - startOfDay(start).getTime()) / 86400000,
    ) + 1,
  );

  for (let i = 0; i < daysCount; i++) {
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

  // Aggregate meals → food_items into daily buckets
  (data ?? []).forEach((meal: any) => {
    const d = new Date(meal.meal_time);
    const key = format(d, 'yyyy-MM-dd');
    const bucket = days[key];
    if (!bucket) return;

    const items = Array.isArray(meal.food_items) ? meal.food_items : [];
    for (const it of items) {
      const c = toNum(it?.calories);
      const p = toNum(it?.protein);
      const f = toNum(it?.fat);
      const cb = toNum(it?.carbs);
      bucket.calories += c;
      bucket.protein += p;
      bucket.fat += f;
      bucket.carbs += cb;
      bucket.entries += 1;
    }
  });

  // Build ordered array
  const daily = Object.values(days).sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  // Totals & averages
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
}

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
}
function toNum(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** Helper: convert macro grams → kcal distribution */
export function gramsToKcalDistribution(g: {
  protein: number;
  fat: number;
  carbs: number;
}) {
  return {
    proteinKcal: g.protein * 4,
    fatKcal: g.fat * 9,
    carbsKcal: g.carbs * 4,
  };
}
