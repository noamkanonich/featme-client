// src/utils/mappers/mealMapper.ts

import { IMeal } from '../../data/meals/IMeal';
import { MealRow } from '../../data/meals/MealRaw';
import { MealType } from '../../data/meals/MealType';
import { foodItemsFromRaw, foodItemsToRaw } from './foodItemMapper';

/* ========================
   Helpers: MealType <-> string
   ======================== */

const MEAL_TYPE_TO_STRING: Record<MealType, string> = {
  [MealType.Breakfast]: 'breakfast',
  [MealType.Lunch]: 'lunch',
  [MealType.Dinner]: 'dinner',
  [MealType.Snack]: 'snack',
  [MealType.Other]: 'other',
};

export const mealTypeToString = (mt?: MealType | null): string | null => {
  if (mt === null || mt === undefined) return null;
  return MEAL_TYPE_TO_STRING[mt] ?? 'other';
};

export const mealTypeFromString = (s?: string | null): MealType | undefined => {
  if (!s) return undefined;
  switch (s.toLowerCase()) {
    case 'breakfast':
      return MealType.Breakfast;
    case 'lunch':
      return MealType.Lunch;
    case 'dinner':
      return MealType.Dinner;
    case 'snack':
      return MealType.Snack;
    case 'other':
      return MealType.Other;
    default:
      return undefined;
  }
};

/* שם ייצוגי יפה ל-name כאשר אין עמודת name ב-DB */
const mealTypeToTitle = (mt?: MealType): string => {
  switch (mt) {
    case MealType.Breakfast:
      return 'Breakfast';
    case MealType.Lunch:
      return 'Lunch';
    case MealType.Dinner:
      return 'Dinner';
    case MealType.Snack:
      return 'Snacks';
    default:
      return 'Meal';
  }
};

/* ========================
   Raw (DB) -> App (camelCase)
   ======================== */

export const toMeal = (
  raw: MealRow & Partial<{ name: string; description?: string }>,
): IMeal => {
  const mtString = mealTypeToString(raw.meal_type);
  const foodItems = foodItemsFromRaw(raw.food_items ?? []);

  return {
    id: raw.id,
    name: raw.name ?? mealTypeToTitle(raw.meal_type),
    description: raw.description ?? undefined,
    mealTime: raw.meal_time,
    mealType: mtString, // לפי הממשק IMeal (string|null)
    foodItems,
    totalCalories: Number(raw.total_calories ?? 0),
    totalProtein: Number(raw.total_protein ?? 0),
    totalFat: Number(raw.total_fat ?? 0),
    totalCarbs: Number(raw.total_carbs ?? 0),
    notes: raw.notes ?? null,
  };
};

/** מערכים: Raw[] -> App[] */
export const mealsFromRows = (
  rows: (MealRow & Partial<{ name: string; description?: string }>)[] = [],
): IMeal[] => rows.map(toMeal);

/* ========================
   App (camelCase) -> Raw (DB)
   ======================== */

/**
 * טיפוס Insert ללא שדות שנוצרים אוטומטית.
 * חובה להעביר userId מבחוץ.
 */
export type MealRowInsert = Omit<MealRow, 'id' | 'created_at' | 'updated_at'>;

/** Insert */
export const toMealRowInsert = (meal: IMeal, userId: string): MealRowInsert => {
  return {
    user_id: userId,
    meal_time: meal.mealTime,
    meal_type: mealTypeFromString(meal.mealType) ?? MealType.Other,
    food_items: foodItemsToRaw(meal.foodItems ?? []),
    notes: meal.notes ?? null,
    total_calories: Number(meal.totalCalories ?? 0),
    total_protein: Number(meal.totalProtein ?? 0),
    total_fat: Number(meal.totalFat ?? 0),
    total_carbs: Number(meal.totalCarbs ?? 0),
  };
};

/**
 * Update חלקי לשורה קיימת (כולל id).
 * החזרנו Partial כדי שתוכל לבחור מה לשנות בפועל בקריאת update.
 */
export const toMealRowUpdate = (
  meal: Partial<IMeal> & { id: string },
): Partial<MealRow> => {
  const patch: Partial<MealRow> = { id: meal.id };

  if (meal.mealTime !== undefined) patch.meal_time = meal.mealTime;
  if (meal.mealType !== undefined)
    patch.meal_type = mealTypeFromString(meal.mealType);
  if (meal.foodItems !== undefined)
    patch.food_items = foodItemsToRaw(meal.foodItems || []);
  if (meal.notes !== undefined) patch.notes = meal.notes ?? null;

  if (meal.totalCalories !== undefined)
    patch.total_calories = Number(meal.totalCalories ?? 0);
  if (meal.totalProtein !== undefined)
    patch.total_protein = Number(meal.totalProtein ?? 0);
  if (meal.totalFat !== undefined) patch.total_fat = Number(meal.totalFat ?? 0);
  if (meal.totalCarbs !== undefined)
    patch.total_carbs = Number(meal.totalCarbs ?? 0);

  // אם יש לך עמודות name/description בטבלה – תוכל להוסיף כאן:
  // if ((meal as any).name !== undefined) (patch as any).name = (meal as any).name;
  // if ((meal as any).description !== undefined) (patch as any).description = (meal as any).description ?? null;

  return patch;
};

/** מערכים: App[] -> RawInsert[] (ל-Bulk Insert) */
export const mealsToRowInserts = (
  meals: IMeal[] = [],
  userId: string,
): MealRowInsert[] => meals.map(m => toMealRowInsert(m, userId));
