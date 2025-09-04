import axios from 'axios';
import { ActivityLevel } from '../data/ActivityLevel';
import { Gender } from '../data/IUser';
import { UnitType } from '../data/UnitType';
import { UserGoalsRow } from '../data/user-goals/UserGoalsRow';
import { UserGoal } from '../data/UserGoal';
import { supabase } from '../lib/supabase/supabase';
import { IUserGoals } from '../data/IUserGoals';

export const createUserGoalsByUserId = async (
  userId: string,
  userGoalsData: any,
) => {
  try {
    // const data = {
    //   id: userGoalsData.id,
    //   user_id: userId,
    //   weight: userGoalsData.weight,
    //   height: userGoalsData.height,
    //   user_goal: userGoalsData.userGoal,
    //   activity_level: userGoalsData.activityLevel,
    //   preferred_units: userGoalsData.preferredUnits,
    //   daily_calories: userGoalsData.dailyTargets.calories,
    //   daily_protein: userGoalsData.dailyTargets.proteinGrams,
    //   daily_fat: userGoalsData.dailyTargets.fatGrams,
    //   daily_carbs: userGoalsData.dailyTargets.carbsGrams,
    //   weight_goal: userGoalsData.userGoal,
    // };

    // const { error } = await supabase
    //   .from('user_goals')
    //   .insert(data)
    //   .select()
    //   .single();

    // if (error) throw error;
    await axios.post('/me/goals', userGoalsData);
  } catch (error) {
    console.error('Error creating user goals:', error);
  }
};

export const getUserGoalsByUserId = async (userId: string) => {
  try {
    const response = await axios.get<IUserGoals>('/me/goals');
    if (!response.data) throw new Error('No user goals found');

    return response.data;
  } catch (error) {
    console.error('Error fetching user goals:', error);
    return null;
  }
};

export const updateUserGoalsByUserId = async (
  userId: string,
  patch: Partial<UserGoalsRow>,
) => {
  const { data, error } = await supabase
    .from('user_goals')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as UserGoalsRow;
};

export type DailyTargets = {
  calories: number;
  proteinGrams: number;
  fatGrams: number;
  carbsGrams: number;
};

type Params = {
  unitType: UnitType;
  height: number;
  weight: number;
  gender: Gender;
  dateBirth: Date;
  activityLevel: ActivityLevel;
  goal: UserGoal;
};

const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v));

const roundTo = (n: number, step: number): number =>
  Math.round(n / step) * step;

const isMetric = (u: UnitType): boolean => u === UnitType.Metric;

const normalizeToMetricHeightCm = (
  height: number,
  unitType: UnitType,
): number =>
  isMetric(unitType)
    ? height < 3
      ? height * 100 // meters -> cm (if dev passed meters)
      : height // already cm
    : height < 10
    ? height * 30.48 // feet -> cm
    : height * 2.54; // inches -> cm

const normalizeToMetricWeightKg = (
  weight: number,
  unitType: UnitType,
): number => (isMetric(unitType) ? weight : weight * 0.45359237); // lb -> kg

const ageFromDOB = (dob: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return clamp(age, 10, 100);
};

const mifflinStJeorBMR = (
  kg: number,
  cm: number,
  age: number,
  gender: Params['gender'],
): number => {
  const g = String(gender).toLowerCase();
  const genderConst = g.includes('male')
    ? 5
    : g.includes('female')
    ? -161
    : -78;
  return 10 * kg + 6.25 * cm - 5 * age + genderConst;
};

// ✅ Uses your numeric enum
const getActivityFactor = (level: ActivityLevel): number => {
  switch (level) {
    case ActivityLevel.Sedentary:
      return 1.2;
    case ActivityLevel.LightlyActive:
      return 1.375;
    case ActivityLevel.ModeratelyActive:
      return 1.55;
    case ActivityLevel.VeryActive:
      return 1.725;
    case ActivityLevel.Athlete:
      return 1.9;
    default:
      return 1.55; // sane default
  }
};

export const calculateDailyTargets = (params: Params): DailyTargets => {
  const heightCm = normalizeToMetricHeightCm(params.height, params.unitType);
  const weightKg = normalizeToMetricWeightKg(params.weight, params.unitType);
  const age = ageFromDOB(params.dateBirth);

  const bmr = mifflinStJeorBMR(weightKg, heightCm, age, params.gender);
  const factor = getActivityFactor(params.activityLevel);
  const tdee = Math.max(bmr * factor, 1200); // sanity floor

  const adj =
    params.goal === UserGoal.LoseFat
      ? 0.65
      : params.goal === UserGoal.GainMuscle
      ? 1.1
      : 1.0;

  const caloriesRaw = Math.max(tdee * 0.8, bmr * 1.05, tdee * adj);
  const calories = roundTo(caloriesRaw, 10);

  const proteinPerKg =
    params.goal === UserGoal.LoseFat
      ? 2.2
      : params.goal === UserGoal.GainMuscle
      ? 2.0
      : 1.6;
  const proteinGrams = roundTo(clamp(proteinPerKg, 1.2, 2.4) * weightKg, 5);

  const fatFromPct = (0.3 * calories) / 9;
  const fatMin = 0.6 * weightKg;
  const fatMax = 1.2 * weightKg;
  const fatGrams = roundTo(clamp(fatFromPct, fatMin, fatMax), 5);

  const usedCalories = proteinGrams * 4 + fatGrams * 9;
  const carbsCalories = Math.max(calories - usedCalories, 0);
  const carbsGrams = roundTo(carbsCalories / 4, 5);

  return { calories, proteinGrams, fatGrams, carbsGrams };
};
