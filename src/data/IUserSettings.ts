import { UnitType } from './UnitType';

export interface IUserSettings {
  id: string; // Unique identifier for the user settings
  userId: string; // Reference to the user ID
  preferredUnits: UnitType; // Preferred units, e.g., 'metric', 'imperial'
  language: string; // Preferred language, e.g., 'en', 'fr'
  theme: number; // Preferred theme, e.g., 'light', 'dark'
  notificationsEnabled: boolean; // Whether notifications are enabled
  dailyReminderTime?: string | null; // Optional daily reminder time in ISO 8601 format
  createdAt?: string; // Timestamp of when the settings were created
  updatedAt?: string; // Timestamp of when the settings were last updated
}
