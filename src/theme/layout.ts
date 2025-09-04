export type Direction = 'horizontal' | 'vertical';
export type Size =
  | 'xxxs'
  | 'xxs'
  | 'xs'
  | 's'
  | 'm'
  | 'l'
  | 'xl'
  | 'xxl'
  | 'xxl-2'
  | 'xxl-3'
  | 'xxl-4'
  | 'xxl-5'
  | 'xxl-6'
  | 'xxl-7'
  | 'xxl-8';

export const Spacing: { [size in Size]: number } = {
  xxxs: 2,
  xxs: 4,
  xs: 8,
  s: 12,
  m: 16,
  l: 20,
  xl: 24,
  xxl: 28,
  'xxl-2': 32,
  'xxl-3': 40,
  'xxl-4': 48,
  'xxl-5': 60,
  'xxl-6': 80,
  'xxl-7': 100,
  'xxl-8': 120,
};
