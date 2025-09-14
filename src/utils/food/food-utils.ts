// src/utils/meal-food-items.ts  (דוגמה לשם קובץ)
import { supabase } from '../../lib/supabase/supabase';
import { FoodItem } from '../../data/food/FoodItem';

// 👇 ממפים (עדכן נתיב אם צריך)

import uuid from 'react-native-uuid';
import { foodItemsFromRaw, foodItemsToRaw } from './food-mappers';

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

const getMealItems = async (mealId: string): Promise<FoodItem[]> => {
  const { data, error } = await supabase
    .from('meals')
    .select('food_items')
    .eq('id', mealId)
    .single();

  if (error) throw error;

  const rawArr = Array.isArray(data?.food_items) ? data!.food_items : [];
  return foodItemsFromRaw(rawArr);
};

const setMealItems = async (
  mealId: string,
  items: FoodItem[],
): Promise<{ id: string; items: FoodItem[]; updatedAt: string | null }> => {
  const raw = foodItemsToRaw(items);
  console.log('RAW FOOD ITEM', raw);
  const { calories, protein, fat, carbs } = calcTotals(items);
  const { data, error } = await supabase
    .from('meals')
    .update({
      food_items: raw,
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

export const addFoodToMeal = async (
  mealId: string,
  foodItem: Partial<FoodItem>,
  selectedDate: Date,
) => {
  try {
    const current = await getMealItems(mealId);

    const itemWithId: FoodItem = {
      id: uuid.v4().toString(),
      mealId: (foodItem as any).mealId ?? mealId,
      name: foodItem.name ?? '',
      description: foodItem.description ?? null,
      calories: foodItem.calories ?? 0,
      protein: foodItem.protein ?? 0,
      fat: foodItem.fat ?? 0,
      carbs: foodItem.carbs ?? 0,
      servingSize: foodItem.servingSize ?? null,
      createdAt: selectedDate,
      updatedAt: foodItem.updatedAt,
      imageUri: foodItem.imageUri ?? null,
      aiGenerated: foodItem.aiGenerated ?? false,
      isFavorite: foodItem.isFavorite ?? false,
      healthLevel: foodItem.healthLevel,
    };

    return await setMealItems(mealId, [...current, itemWithId]);
  } catch (err) {
    console.error('Error adding food item to meal:', err);
    throw err;
  }
};

export const removeFoodFromMeal = async (
  mealId: string,
  foodItemId: string,
) => {
  try {
    const current = await getMealItems(mealId);
    const next = current.filter(i => i.id !== foodItemId);
    return await setMealItems(mealId, next);
  } catch (err) {
    console.error('Error removing food item from meal:', err);
    throw err;
  }
};

export const updateFoodInMeal = async (
  mealId: string,
  updatedFoodItem: Partial<FoodItem> & { id: string },
) => {
  try {
    console.log('Updating food item in meal:', mealId, updatedFoodItem);
    const current = await getMealItems(mealId);
    const idx = current.findIndex(i => i.id === updatedFoodItem.id);
    if (idx === -1) throw new Error('Food item not found in meal');

    const merged: FoodItem = { ...current[idx], ...updatedFoodItem };
    const next = [...current];
    next[idx] = merged;

    return await setMealItems(mealId, next);
  } catch (err) {
    console.error('Error updating food item in meal:', err);
    throw err;
  }
};

// אופציונלי:
export const getFoodItemById = async (mealId: string, foodItemId: string) => {
  const items = await getMealItems(mealId);
  return items.find(i => i.id === foodItemId) ?? null;
};
