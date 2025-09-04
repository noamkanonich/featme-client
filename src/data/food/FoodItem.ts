export type FoodItem = {
  id: string;
  mealId: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  cholesterol: number;
  fiber: number;
  description?: string | null;
  servingSize?: string | null; // e.g., "100g"
  imageUri?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  isFavorite?: boolean;
  aiGenerated?: boolean;
};
