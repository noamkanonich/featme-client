import { UnitType } from '../UnitType';

export type UserSettingsRow = {
  id: string | number;
  user_id: string | number;
  language: string;
  preferred_units: UnitType;
  measurement_system: UnitType;
  notifications_enabled: boolean;
  theme: number;
  privacy_sharing: boolean;
  daily_reminder_time?: string | null;
  created_at?: string;
  updated_at?: string;
};
