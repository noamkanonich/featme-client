import { MealType } from '../../data/meals/MealType';

export type MealTypeName = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';

type Badge = { bg: string; fg: string; label: MealTypeName; emoji: string };

export const MEAL_BADGE: Record<MealType, Badge> = {
  [MealType.Breakfast]: {
    bg: '#FEF3C7',
    fg: '#92400E',
    label: 'breakfast',
    emoji: '🌅',
  },
  [MealType.Lunch]: {
    bg: '#DBEAFE',
    fg: '#1E3A8A',
    label: 'lunch',
    emoji: '🌞',
  },
  [MealType.Dinner]: {
    bg: '#EDE9FE',
    fg: '#5B21B6',
    label: 'dinner',
    emoji: '🌜',
  },
  [MealType.Snack]: {
    bg: '#DCFCE7',
    fg: '#166534',
    label: 'snack',
    emoji: '🍎',
  },
  [MealType.Other]: {
    bg: '#E5E7EB',
    fg: '#374151',
    label: 'other',
    emoji: '🍽️',
  },
};

// אופציונלי: עזר בטוח עם fallback ל-Other
export const getMealBadge = (type: MealType): Badge =>
  MEAL_BADGE[type] ?? MEAL_BADGE[MealType.Other];

export const mealTypeFromString = (value: string): MealType => {
  const lower = value?.toLowerCase().trim();

  switch (lower) {
    case 'breakfast':
      return MealType.Breakfast;
    case 'lunch':
      return MealType.Lunch;
    case 'dinner':
      return MealType.Dinner;
    case 'snack':
      return MealType.Snack;
    default:
      return MealType.Other;
  }
};
