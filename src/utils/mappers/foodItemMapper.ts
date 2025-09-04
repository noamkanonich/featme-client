// src/utils/mappers/foodItemMapper.ts

import { FoodItem } from '../../data/food/FoodItem';
import { FoodItemRaw } from '../../data/food/FoodItemRaw';

/** Raw (DB) -> App (camelCase) */
export const toFoodItem = (raw: FoodItemRaw): FoodItem => {
  return {
    id: raw.id,
    mealId: raw.meal_id,
    name: raw.name,
    description: raw.description ?? null,
    calories: Number(raw.calories ?? 0),
    protein: Number(raw.protein ?? 0),
    fat: Number(raw.fat ?? 0),
    carbs: Number(raw.carbs ?? 0),
    servingSize: raw.serving_size ?? null,
    imageUri: raw.image_uri ?? null,
    createdAt: raw.created_at ?? undefined,
    updatedAt: raw.updated_at ?? undefined,
  };
};

/** App (camelCase) -> Raw (DB) */
export const toFoodItemRow = (item: FoodItem): FoodItemRaw => {
  console.log(item);
  return {
    id: item.id,
    meal_id: item.mealId,
    name: item.name,
    description: item.description ?? null,
    calories: Number(item.calories ?? 0),
    protein: Number(item.protein ?? 0),
    fat: Number(item.fat ?? 0),
    carbs: Number(item.carbs ?? 0),
    serving_size: item.servingSize ?? null,
    image_uri: item.imageUri ?? null,
    created_at: item.createdAt ?? undefined, // יושמט ב-JSON.stringify אם undefined
    updated_at: item.updatedAt ?? undefined,
  };
};

/** מערכים: Raw[] -> App[] */
export const foodItemsFromRaw = (rows: FoodItemRaw[] = []): FoodItem[] => {
  return rows.map(toFoodItem);
};

/** מערכים: App[] -> Raw[] */
export const foodItemsToRaw = (items: FoodItem[] = []): FoodItemRaw[] => {
  return items.map(toFoodItemRow);
};
