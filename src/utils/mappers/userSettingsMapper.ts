// src/utils/mappers/userSettingsMapper.ts

import { IUserSettings } from '../../data/IUserSettings';
import { UnitType } from '../../data/UnitType';
import { UserSettingsRow } from '../../data/user-settings/UserSettingsRow';

/** Raw (DB, snake_case) -> App (camelCase) */
export const toUserSettings = (raw: UserSettingsRow): IUserSettings => {
  return {
    id: String(raw.id),
    userId: String(raw.user_id),
    preferredUnits: raw.preferred_units ?? null,
    language: raw.language,
    theme: raw.theme,
    notificationsEnabled: Boolean(raw.notifications_enabled),
    dailyReminderTime: raw.daily_reminder_time ?? null,
    createdAt: raw.created_at ?? undefined,
    updatedAt: raw.updated_at ?? undefined,
  };
};

/** App (camelCase) -> Raw (DB, snake_case) */
export const toUserSettingsRow = (item: IUserSettings): UserSettingsRow => {
  return {
    id: item.id,
    user_id: item.userId,
    preferred_units: item.preferredUnits || UnitType.Metric,
    language: item.language,
    theme: item.theme,
    notifications_enabled: item.notificationsEnabled,
    daily_reminder_time: item.dailyReminderTime ?? null,
    created_at: item.createdAt ?? undefined,
    updated_at: item.updatedAt ?? undefined,
  };
};

/** מערכים: Raw[] -> App[] */
export const userSettingsFromRaw = (
  rows: UserSettingsRow[] = [],
): IUserSettings[] => rows.map(toUserSettings);

/** מערכים: App[] -> Raw[] */
export const userSettingsToRaw = (
  items: IUserSettings[] = [],
): UserSettingsRow[] => items.map(toUserSettingsRow);

/** Patch mapper: Partial<IUserSettings> -> Partial<UserSettingsRow> */
export const userSettingsPatchToRow = (
  patch: Partial<IUserSettings>,
): Partial<UserSettingsRow> => {
  const out: Partial<UserSettingsRow> = {};

  if (patch.preferredUnits !== undefined)
    out.preferred_units = patch.preferredUnits;
  if (patch.language !== undefined) out.language = patch.language;
  if (patch.theme !== undefined) out.theme = patch.theme;
  if (patch.notificationsEnabled !== undefined)
    out.notifications_enabled = patch.notificationsEnabled;
  if (patch.dailyReminderTime !== undefined)
    out.daily_reminder_time = patch.dailyReminderTime;

  return out;
};
