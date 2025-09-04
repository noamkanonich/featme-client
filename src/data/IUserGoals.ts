import { ActivityLevel } from './ActivityLevel';
import { UserGoal } from './UserGoal';

export interface IUserGoals {
  id: string; // Unique identifier for the user GOALS
  userId: string; // Reference to the user ID
  weight: number; // User's weight in preferred units
  height: number; // User's height in preferred units
  userGoal: UserGoal; // User's goal, e.g., 'LoseFat', 'MaintainWeight'
  activityLevel: ActivityLevel; // User's activity level, e.g., 'Sedentary', 'LightlyActive'
  dailyCalories: number; // Daily calorie target
  dailyProtein: number; // Daily protein target in grams
  dailyFat: number; // Daily fat target in grams
  dailyCarbs: number; // Daily carbohydrate target in grams
  weightGoal?: number | null; // Optional weight goal
}
