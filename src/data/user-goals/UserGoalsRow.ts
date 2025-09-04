import { ActivityLevel } from '../ActivityLevel';
import { UserGoal } from '../UserGoal';

export type UserGoalsRow = {
  id: string | number;
  user_id: string | number;
  weight: number;
  height: number;
  user_goal: UserGoal;
  activity_level: ActivityLevel;
  preferred_units: string | null;
  daily_calories: number;
  daily_protein: number;
  daily_fat: number;
  daily_carbs: number;
  weight_goal: number | null;
  created_at?: string;
  updated_at?: string;
};
