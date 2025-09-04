import { FoodItemRaw } from '../food/FoodItemRaw';
import { MealType } from './MealType';

export type MealRow = {
  id: string;
  user_id: string;
  meal_time: string; // ISO
  meal_type?: MealType;
  food_items?: FoodItemRaw[] | null; // JSONB
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  total_calories?: number | null;
  total_protein?: number | null;
  total_fat?: number | null;
  total_carbs?: number | null;
};
