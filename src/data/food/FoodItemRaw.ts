export type FoodItemRaw = {
  id: string;
  meal_id: string;
  name: string;
  description?: string | null;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  serving_size?: string | null; // e.g., "100g"
  image_uri?: string | null;
  created_at?: string;
  updated_at?: string;
};
