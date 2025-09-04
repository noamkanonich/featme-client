// utils/meals.ts
import { endOfDay, startOfDay } from 'date-fns';
import { supabase } from '../lib/supabase/supabase';

// ממפים חדשים
import { toMeal, toMealRowInsert } from '../utils/mappers/mealMapper';
import { MealType } from '../data/meals/MealType';
import { IMeal } from '../data/meals/IMeal';

type CreateDefaults = Partial<{
  name: string;
  description: string | null;
  notes: string | null;
  food_items: any[]; // if you store JSONB items on the meal
  meal_time: string; // override timestamp
}>;

export const getMealByHour = (): MealType => {
  const hour = new Date().getHours();
  if (hour < 11 && hour >= 7) return MealType.Breakfast;
  if (hour >= 12 && hour < 15) return MealType.Lunch;
  if (hour >= 19 && hour < 23) return MealType.Dinner;
  return MealType.Snack;
};

export const getMealIdByTypeAndDate = async (
  userId: string,
  mealType: MealType,
  date: Date,
): Promise<string | null> => {
  const startIso = startOfDay(date).toISOString();
  const endIso = endOfDay(date).toISOString();

  const { data, error } = await supabase
    .from('meals')
    .select('id')
    .eq('user_id', userId)
    .eq('meal_type', mealType)
    .gte('meal_time', startIso)
    .lte('meal_time', endIso)
    .order('meal_time', { ascending: true })
    .limit(1);

  if (error) throw error;

  return data?.[0]?.id ?? null;
};

export const getMeals = () => {
  return [
    { value: MealType.Breakfast, label: 'breakfast' },
    { value: MealType.Lunch, label: 'lunch' },
    { value: MealType.Dinner, label: 'dinner' },
    { value: MealType.Snack, label: 'snacks' },
  ];
};

export const getMealsByDate = async (
  userId: string,
  date: Date,
): Promise<IMeal[]> => {
  const from = startOfDay(date).toISOString();
  const to = endOfDay(date).toISOString();

  try {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .gte('meal_time', from)
      .lte('meal_time', to)
      .order('meal_time', { ascending: true });

    if (error) throw error;
    return Array.isArray(data) ? data.map(toMeal) : [];
  } catch (err) {
    console.error('Error fetching meals:', err);
    return [];
  }
};

// ----------------------------------------------------
// CRUD (מיושרים ל-mappers החדשים)
// ----------------------------------------------------
// export const createMeal = async (userId: string, meal: IMeal) => {
//   try {
//     const rowInsert = toMealRowInsert(meal, userId);
//     const { data, error } = await supabase
//       .from('meals')
//       .insert(rowInsert)
//       .select('*')
//       .single();

//     if (error) throw error;
//     return toMeal(data); // החזרה בפורמט האפליקציה
//   } catch (err) {
//     console.error('Error creating meal:', err);
//     return null;
//   }
// };

export const updateMeal = async (meal: Partial<IMeal> & { id: string }) => {
  // אופציונלי: השתמש ב-toMealRowUpdate אם בנית אותו
  // נשאיר ריק כי לא ביקשת מימוש כאן
};

export const deleteMeal = async (mealId: string) => {
  try {
    const { error } = await supabase.from('meals').delete().eq('id', mealId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting meal:', err);
    return false;
  }
};

// ----------------------------------------------------
// ensureMealForDate – מחפש ארוחה ליום/סוג, יוצר אם אין
// ----------------------------------------------------

const inflight = new Map<string, Promise<IMeal>>();

const dayKeyUTC = (d: Date) => {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};

export const ensureMealForDate = async (
  userId: string,
  type: MealType,
  date: Date = new Date(),
  defaults: Partial<IMeal> = {},
): Promise<IMeal> => {
  console.log(
    `ensureMealForDate: userId=${userId}, type=${type}, date=${date.toISOString()}`,
  );
  const key = `${userId}:${type}:${dayKeyUTC(date)}`;
  if (inflight.has(key)) return inflight.get(key)!;

  const p = (async () => {
    const fromIso = startOfDay(date).toISOString();
    const toIso = endOfDay(date).toISOString();

    // 1) Try to find existing (robust against duplicates: take the earliest)
    const { data: rows, error: findErr } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .eq('meal_type', type) // numeric enum
      .gte('meal_time', fromIso)
      .lte('meal_time', toIso)
      .order('meal_time', { ascending: true })
      .limit(1);

    if (findErr) throw findErr;
    if (rows && rows.length) return toMeal(rows[0]);

    // 2) Create one (set noon of selected date to avoid “today” time sneaking in)
    const noon = new Date(date);
    noon.setHours(12, 0, 0, 0);

    const rowInsert = {
      user_id: userId,
      meal_type: type,
      meal_time: defaults.mealTime ?? noon.toISOString(),
      name: defaults.name ?? '',
      description: defaults.description ?? null,
      notes: defaults.notes ?? null,
      food_items: defaults.foodItems ?? [],
      total_calories: defaults.totalCalories ?? 0,
      total_protein: defaults.totalProtein ?? 0,
      total_fat: defaults.totalFat ?? 0,
      total_carbs: defaults.totalCarbs ?? 0,
    };

    const { data: created, error: insErr } = await supabase
      .from('meals')
      .insert(rowInsert)
      .select('*')
      .single();

    if (insErr) throw insErr;
    return toMeal(created!);
  })();

  inflight.set(key, p);
  try {
    return await p;
  } finally {
    inflight.delete(key);
  }
};
// קיצור להיום
export const ensureTodayMeal = async (
  userId: string,
  type: MealType,
  defaults?: Partial<IMeal>,
) => ensureMealForDate(userId, type, new Date(), defaults);
