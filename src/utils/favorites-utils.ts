// utils/favorites.ts
import { supabase } from '../lib/supabase/supabase';
import { FoodItem } from '../data/food/FoodItem';

type FavoriteRow = {
  id: string;
  food_id: string;
  user_id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  serving_size?: string | null;
  created_at?: string;
  updated_at?: string;
};

export const checkIfFavoriteExists = async (
  userId: string,
  foodId: string,
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('food_id', foodId)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // Ignore "No rows found" error
    return !!data;
  } catch (err) {
    console.error('Error checking favorite existence:', err);
    return false;
  }
};

export const addFoodToFavorites = async (
  userId: string,
  foodItem: Partial<FoodItem>,
): Promise<FavoriteRow | null> => {
  try {
    if (!userId) throw new Error('userId is required');
    if (!foodItem?.name) throw new Error('foodItem.name is required');

    const payload = {
      food_id: foodItem.id ?? null,
      user_id: userId,
      name: foodItem.name,
      calories: Number(foodItem.calories ?? 0),
      protein: Number(foodItem.protein ?? 0),
      fat: Number(foodItem.fat ?? 0),
      carbs: Number(foodItem.carbs ?? 0),
      serving_size: foodItem.servingSize ?? null,
    };

    const { data, error } = await supabase
      .from('favorites')
      .insert(payload)
      .select('*')
      .single();

    if (error) throw error;
    return data as FavoriteRow;
  } catch (err) {
    console.error('Error adding food item to favorites:', err);
    return null;
  }
};

export const removeFavorite = async (
  userId: string,
  foodId: string,
): Promise<boolean> => {
  try {
    if (!userId) throw new Error('userId is required');
    if (!foodId) throw new Error('foodId is required');

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('food_id', foodId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error removing favorite:', err);
    return false;
  }
};
