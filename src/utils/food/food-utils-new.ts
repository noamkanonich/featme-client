// src/utils/meal-items.ts

import { endOfDay, startOfDay } from 'date-fns';
import { FoodItem } from '../../data/food/FoodItem';
import { supabase } from '../../lib/supabase/supabase';
import { foodItemsFromRaw, toFoodItem, toFoodItemRaw } from './food-mappers';
import { removeAllMealItemComponents } from '../meal-item-components/meal-item-components-utils';

// --- Table names (centralized so you can tweak once) ---
const MEAL_ITEMS_TABLE = 'meal_items';
const FOOD_FAVORITES_TABLE = 'favorites';

const calcTotals = (items: FoodItem[] = []) => {
  return items.reduce(
    (acc, it) => {
      acc.calories += Number(it.calories ?? 0);
      acc.protein += Number(it.protein ?? 0);
      acc.fat += Number(it.fat ?? 0);
      acc.carbs += Number(it.carbs ?? 0);
      return acc;
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0 },
  );
};

// ---------- GET ----------
/**
 * Fetch all food items for a given meal, newest first.
 */
export const getMealItems = async (mealId: string): Promise<FoodItem[]> => {
  try {
    const { data, error } = await supabase
      .from(MEAL_ITEMS_TABLE)
      .select('*')
      .eq('meal_id', mealId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(toFoodItem);
  } catch (err: any) {
    throw new Error(
      `getMealItems failed (mealId=${mealId}): ${err.message ?? err}`,
    );
  }
};

export const updateMealNutritions = async (
  mealId: string,
  items: FoodItem[],
): Promise<{ id: string; items: FoodItem[]; updatedAt: string | null }> => {
  const { calories, protein, fat, carbs } = calcTotals(items);
  const { data, error } = await supabase
    .from('meals')
    .update({
      total_calories: calories,
      total_protein: protein,
      total_fat: fat,
      total_carbs: carbs,
      updated_at: new Date().toISOString(),
    })
    .eq('id', mealId)
    .select('id, food_items, updated_at')
    .single();

  if (error) throw error;

  return {
    id: data.id as string,
    items: foodItemsFromRaw(
      Array.isArray(data.food_items) ? data.food_items : [],
    ),
    updatedAt: (data.updated_at as string) ?? null,
  };
};

export const getMealItemsByDate = async (
  userId: string,
  date: Date,
): Promise<FoodItem[]> => {
  const from = startOfDay(date).toISOString();
  const to = endOfDay(date).toISOString();

  try {
    const { data, error } = await supabase
      .from('meal_items')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', from)
      .lte('created_at', to)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return Array.isArray(data) ? data.map(toFoodItem) : [];
  } catch (err) {
    console.error('Error fetching meal items:', err);
    return [];
  }
};

// ---------- CREATE ----------
/**
 * Add a food item to a meal.
 * Accepts a FoodItemRaw (domain form) and maps it to DB shape as needed.
 * Returns the inserted item mapped to FoodItem.
 */
export const addFoodItemToMeal = async (
  mealId: string,
  item: FoodItem,
  selectedDate: Date,
): Promise<FoodItem> => {
  try {
    const insertPayload = {
      ...toFoodItemRaw(item),
      meal_id: mealId,
      created_at: selectedDate.toISOString(),
    };

    const { data, error } = await supabase
      .from(MEAL_ITEMS_TABLE)
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Insert returned no data');

    const remaining = await getMealItems(mealId);
    await updateMealNutritions(mealId, remaining);
    return toFoodItem(data);
  } catch (err: any) {
    throw new Error(
      `addFoodToMeal failed (mealId=${mealId}): ${err.message ?? err}`,
    );
  }
};

// ---------- UPDATE ----------
/**
 * Update a food item by id. Pass only the fields you want to change.
 * The patch is in FoodItemRaw terms; we map to DB shape before update.
 */
export const updateFoodItem = async (
  updatedFoodItem: FoodItem,
  mealId: string,
): Promise<FoodItem> => {
  try {
    const updatePayload = toFoodItemRaw(updatedFoodItem as FoodItem);

    const { data, error } = await supabase
      .from(MEAL_ITEMS_TABLE)
      .update({ ...updatePayload, updated_at: new Date().toISOString() })
      .eq('id', updatedFoodItem.id)
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Update returned no data');

    const remaining = await getMealItems(mealId);
    await updateMealNutritions(mealId, remaining);

    return toFoodItem(data);
  } catch (err: any) {
    throw new Error(
      `updateFoodItem failed (itemId=${updatedFoodItem.id}): ${
        err.message ?? err
      }`,
    );
  }
};

// ---------- DELETE ----------
/**
 * Remove a food item from a meal by item id.
 * Returns true if a row was deleted.
 */
export const removeFoodItemFromMeal = async (
  itemId: string,
  mealId?: string,
): Promise<boolean> => {
  try {
    const { error, count } = await supabase
      .from(MEAL_ITEMS_TABLE)
      .delete({ count: 'exact' })
      .eq('id', itemId);

    if (error) throw error;

    await removeAllMealItemComponents(itemId);

    if ((count ?? 0) > 0 && mealId) {
      const remaining = await getMealItems(mealId);
      await updateMealNutritions(mealId, remaining);
    }

    return (count ?? 0) > 0;
  } catch (err: any) {
    throw new Error(
      `removeFoodItemFromMeal failed (itemId=${itemId}): ${err.message ?? err}`,
    );
  }
};

// ---------- FAVORITE CHECK ----------
/**
 * Check if a given meal item is marked as favorite by a user.
 * Assumes FOOD_FAVORITES_TABLE has: user_id, meal_item_id.
 */
export const checkIfFoodIsFavorite = async (
  userId: string,
  mealItemId: string,
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(FOOD_FAVORITES_TABLE)
      .select('id')
      .eq('user_id', userId)
      .eq('meal_item_id', mealItemId)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (err: any) {
    throw new Error(
      `checkIfFoodIsFavorite failed (userId=${userId}, mealItemId=${mealItemId}): ${
        err.message ?? err
      }`,
    );
  }
};
