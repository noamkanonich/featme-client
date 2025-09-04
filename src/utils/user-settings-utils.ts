import { UserSettingsRow } from '../data/user-settings/UserSettingsRow';
import { supabase } from '../lib/supabase/supabase';

export const getUserSettingsByUserId = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle<any>();

    if (error) {
      console.error('Error fetching user settings:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Error getting user settings:', err);
  }
};

export const updateUserSettingsByUserId = async (
  userId: string,
  patch: Partial<UserSettingsRow>,
) => {
  const { data, error } = await supabase
    .from('user_settings')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as UserSettingsRow;
};
