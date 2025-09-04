export interface IRecipe {
  id: string;
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: number; // in minutes
  cookTime?: number; // in minutes
  servings?: number;
  caloriesPerServing?: number;
  proteinPerServing?: number; // in grams
  fatPerServing?: number; // in grams
  carbsPerServing?: number; // in grams
  imageUri?: string;
  tags?: string[];
  sourceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
