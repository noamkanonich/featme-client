import axios from 'axios';
import { ActivityLevel } from '../../data/ActivityLevel';
import { Gender } from '../../data/user/IUser';
import { UnitType } from '../../data/UnitType';
import { UserGoalsRaw } from '../../data/user-goals/UserGoalsRaw';
import { UserGoal } from '../../data/UserGoal';
import { supabase } from '../../lib/supabase/supabase';
import { IUserGoals } from '../../data/IUserGoals';

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
  patch: Partial<UserGoalsRaw>,
) => {
  const { data, error } = await supabase
    .from('user_goals')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as UserGoalsRaw;
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

  // --- Helpers ---
  const cmToInches = (cm: number) => cm / 2.54;
  const inchesOver5ft = Math.max(cmToInches(heightCm) - 60, 0);

  // Devine IBW (kg)
  const ibwKg = String(params.gender).toLowerCase().includes('male')
    ? (50 + 2.3 * inchesOver5ft) * 0.45359237
    : (45.5 + 2.3 * inchesOver5ft) * 0.45359237;

  // Adjusted BW for obesity (BMI>=30): AdjBW = IBW + 0.4*(Actual-IBW)
  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  const adjustedBwKg = ibwKg + 0.4 * (weightKg - ibwKg);
  const proteinRefKg =
    bmi >= 30 ? Math.max(adjustedBwKg, ibwKg * 0.9) : weightKg;

  // --- Energy (Mifflin–St Jeor) ---
  const bmr = mifflinStJeorBMR(weightKg, heightCm, age, params.gender);
  const activity = getActivityFactor(params.activityLevel);
  const tdee = bmr * activity;

  // Goal adjustment (typical evidence-based ranges)
  const goal = params.goal;
  let calorieTarget = tdee;
  if (goal === UserGoal.LoseFat) {
    // 15–25% deficit; aim 20%
    calorieTarget = tdee * 0.8;
  } else if (goal === UserGoal.GainMuscle) {
    // 10–15% surplus; aim 10% (lean gain)
    calorieTarget = tdee * 1.1;
  }

  // Gender-aware safe floors (not medical advice, just guard rails)
  const genderLower = String(params.gender).toLowerCase().includes('male')
    ? 1500
    : 1200;
  // Ensure not below BMR*1.05 (to avoid extreme underfeeding when sedentary)
  calorieTarget = Math.max(
    calorieTarget,
    Math.min(tdee * 0.85, bmr * 1.05),
    genderLower,
  );

  // --- Protein (g/kg) ---
  // Base by activity
  const baseByActivity =
    params.activityLevel === ActivityLevel.Sedentary
      ? 1.4
      : params.activityLevel === ActivityLevel.LightlyActive
      ? 1.6
      : params.activityLevel === ActivityLevel.ModeratelyActive
      ? 1.8
      : params.activityLevel === ActivityLevel.VeryActive
      ? 2.0
      : 2.2; // Athlete

  // Goal tweak
  const goalAdj =
    goal === UserGoal.LoseFat ? 0.2 : goal === UserGoal.GainMuscle ? 0.2 : 0.0;

  // Senior bump (≥60y): +0.2 g/kg
  const seniorAdj = age >= 60 ? 0.2 : 0;

  let proteinPerKg = clamp(baseByActivity + goalAdj + seniorAdj, 1.2, 2.4);
  let proteinGrams = proteinPerKg * proteinRefKg;

  // --- Fat (g) ---
  // 25–35% of calories, clamped to 0.5–1.2 g/kg
  const fatPct =
    goal === UserGoal.LoseFat ? 0.25 : goal === UserGoal.GainMuscle ? 0.3 : 0.3;

  let fatGramsFromPct = (calorieTarget * fatPct) / 9;
  const fatMin = 0.5 * weightKg;
  const fatMax = 1.2 * weightKg;
  let fatGrams = clamp(fatGramsFromPct, fatMin, fatMax);

  // --- Carbs (g) = remainder ---
  const usedCalories = proteinGrams * 4 + fatGrams * 9;
  let carbsGrams = Math.max((calorieTarget - usedCalories) / 4, 0);

  // --- Rounding (pleasant UI) ---
  const calories = roundTo(calorieTarget, 10);
  proteinGrams = roundTo(proteinGrams, 5);
  fatGrams = roundTo(fatGrams, 5);
  carbsGrams = roundTo(carbsGrams, 5);

  return {
    calories,
    proteinGrams,
    fatGrams,
    carbsGrams,
  };
};
