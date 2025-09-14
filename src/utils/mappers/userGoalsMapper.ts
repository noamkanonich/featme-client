// src/utils/mappers/userGoalsMapper.ts

import { ActivityLevel } from '../../data/ActivityLevel';
import { IUserGoals } from '../../data/IUserGoals';
import { UserGoalsRow } from '../../data/user-goals/UserGoalsRaw';
import { UserGoal } from '../../data/UserGoal';

export const USER_GOAL_TO_STRING: Record<UserGoal, string> = {
  [UserGoal.LoseFat]: 'lose',
  [UserGoal.MaintainWeight]: 'maintain',
  [UserGoal.GainMuscle]: 'gain',
};
export const USER_GOAL_FROM_STRING: Record<string, UserGoal> = {
  lose: UserGoal.LoseFat,
  maintain: UserGoal.MaintainWeight,
  gain: UserGoal.GainMuscle,
};

export const ACTIVITY_LEVEL_TO_STRING: Record<ActivityLevel, string> = {
  [ActivityLevel.Sedentary]: 'sedentary',
  [ActivityLevel.LightlyActive]: 'light',
  [ActivityLevel.ModeratelyActive]: 'moderate',
  [ActivityLevel.VeryActive]: 'active',
  [ActivityLevel.Athlete]: 'extra',
};
export const ACTIVITY_LEVEL_FROM_STRING: Record<string, ActivityLevel> = {
  sedentary: ActivityLevel.Sedentary,
  light: ActivityLevel.LightlyActive,
  moderate: ActivityLevel.ModeratelyActive,
  active: ActivityLevel.VeryActive,
  extra: ActivityLevel.Athlete,
};

/** Raw (DB, snake_case) -> App (camelCase) */
export const toUserGoals = (raw: UserGoalsRow): IUserGoals => {
  return {
    id: String(raw.id),
    userId: String(raw.user_id),
    weight: Number(raw.weight),
    height: Number(raw.height),
    userGoal: Number(raw.user_goal), // enum נשמר כפי שהוא
    activityLevel: Number(raw.activity_level), // enum נשמר כפי שהוא
    dailyCalories: Number(raw.daily_calories),
    dailyProtein: Number(raw.daily_protein),
    dailyFat: Number(raw.daily_fat),
    dailyCarbs: Number(raw.daily_carbs),
    weightGoal: raw.weight_goal ?? null,
  };
};

/** App (camelCase) -> Raw (DB, snake_case) */
export const toUserGoalsRow = (item: IUserGoals): UserGoalsRow => {
  return {
    id: item.id,
    user_id: item.userId,
    weight: item.weight,
    height: item.height,
    user_goal: item.userGoal, // enum → enum (אין המרה)
    activity_level: item.activityLevel, // enum → enum
    preferred_units: null, // אין שדה מקביל ב-IUserGoals כרגע
    daily_calories: item.dailyCalories,
    daily_protein: item.dailyProtein,
    daily_fat: item.dailyFat,
    daily_carbs: item.dailyCarbs,
    weight_goal: item.weightGoal ?? null,
    // created_at / updated_at מנוהלים ע"י ה-DB; נשאיר undefined כדי שיושמטו ב-JSON
    created_at: undefined,
    updated_at: undefined,
  };
};

/** מערכים: Raw[] -> App[] */
export const userGoalsFromRaw = (rows: UserGoalsRow[] = []): IUserGoals[] => {
  return rows.map(toUserGoals);
};

/** מערכים: App[] -> Raw[] */
export const userGoalsToRaw = (items: IUserGoals[] = []): UserGoalsRow[] => {
  return items.map(toUserGoalsRow);
};

/** Patch mapper: Partial<IUserGoals> -> Partial<UserGoalsRow>
 * שימושי לעדכון לפי userId בלי להמיר enums למחרוזת (נשאר enums).
 */
export const userGoalsPatchToRow = (
  patch: Partial<IUserGoals>,
): Partial<UserGoalsRow> => {
  const out: Partial<UserGoalsRow> = {};

  if (patch.weight !== undefined) out.weight = patch.weight;
  if (patch.height !== undefined) out.height = patch.height;
  if (patch.userGoal !== undefined) out.user_goal = patch.userGoal;
  if (patch.activityLevel !== undefined)
    out.activity_level = patch.activityLevel;
  if (patch.dailyCalories !== undefined)
    out.daily_calories = patch.dailyCalories;
  if (patch.dailyProtein !== undefined) out.daily_protein = patch.dailyProtein;
  if (patch.dailyFat !== undefined) out.daily_fat = patch.dailyFat;
  if (patch.dailyCarbs !== undefined) out.daily_carbs = patch.dailyCarbs;
  if (patch.weightGoal !== undefined) out.weight_goal = patch.weightGoal;

  // אם הוספת בעתיד ל-IUserGoals: preferredUnits?: string | null
  // if ('preferredUnits' in (patch as any)) out.preferred_units = (patch as any).preferredUnits ?? null;

  return out;
};
