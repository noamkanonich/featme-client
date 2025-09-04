export interface IMeal {
  id: string;
  name: string;
  description?: string; // Optional description of the meal
  mealTime: string; // ISO 8601 format for meal time
  mealType?: string | null; // e.g., breakfast, lunch, dinner, snack
  foodItems?: any[] | null; // Array of food items, can be JSONB
  totalCalories: number; // Total calories for the meal
  totalProtein: number; // Total protein in grams
  totalFat: number; // Total fat in fatGrams
  totalCarbs: number; // Total carbohydrates in grams
  notes?: string | null; // Additional notes for the meal
}
