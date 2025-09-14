// src/utils/history-utils.ts (or your original file)
import { addDays, endOfDay, format, startOfDay } from 'date-fns';
import { supabase } from '../../lib/supabase/supabase';
import { DailyData } from '../../components/cards/DailyBreakdownCard';

type MealRowForHistory = {
  meal_time: string;
  total_calories: number; // aggregated from meal_items
  items_count: number; // number of meal_items for that meal
};

type MealDbRow = { id: string; meal_time: string };
type MealItemDbRow = { meal_id: string; calories?: number | null };

const toNum = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Fetch meals for a user within a date range (inclusive day bounds) and aggregate their items. */
export const fetchMealsForRange = async (
  userId: string,
  rangeStart: Date,
  rangeEnd: Date,
): Promise<MealRowForHistory[]> => {
  const fromIso = startOfDay(rangeStart).toISOString();
  const toIso = endOfDay(rangeEnd).toISOString();

  // 1) Meals in range
  const { data: meals, error: mealsErr } = await supabase
    .from('meals')
    .select('id, meal_time')
    .eq('user_id', userId)
    .gte('meal_time', fromIso)
    .lte('meal_time', toIso)
    .order('meal_time', { ascending: true });

  if (mealsErr) {
    console.log('fetchMealsForRange meals error:', mealsErr);
    return [];
  }
  if (!meals || meals.length === 0) return [];

  const mealIds = (meals as MealDbRow[]).map(m => m.id);

  // 2) Items for those meals
  const { data: items, error: itemsErr } = await supabase
    .from('meal_items')
    .select('meal_id, calories')
    .in('meal_id', mealIds);

  if (itemsErr) {
    console.log('fetchMealsForRange meal_items error:', itemsErr);
    return [];
  }

  // 3) Aggregate per meal
  const agg = new Map<string, { total: number; count: number }>();
  for (const it of (items ?? []) as MealItemDbRow[]) {
    const k = it.meal_id;
    if (!k) continue;
    const entry = agg.get(k) ?? { total: 0, count: 0 };
    entry.total += toNum(it.calories);
    entry.count += 1;
    agg.set(k, entry);
  }

  // 4) Return rows shaped for the UI aggregators
  return (meals as MealDbRow[]).map(m => {
    const a = agg.get(m.id) ?? { total: 0, count: 0 };
    return {
      meal_time: m.meal_time,
      total_calories: a.total,
      items_count: a.count,
    };
  });
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
    const day = bucket[key];
    if (!day) return;

    day.calories += toNum(row.total_calories);
    day.entries += row.items_count ?? 0;
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
