import axios from 'axios';
import { IUser } from '../data/IUser';
import { supabase } from '../lib/supabase/supabase';

export const updateUserOnDB = async (updatedUser: IUser | undefined) => {
  if (!updatedUser) {
    console.warn('No user data provided for update.');
    return;
  }
  try {
    console.log('Updating user in database:', updatedUser);
    const data = {
      id: updatedUser.id,
      full_name: updatedUser.fullName ?? null,
      email: updatedUser.email ?? null,
      phone_number: updatedUser.phoneNumber ?? null,
      date_birth: updatedUser.dateBirth ?? null,
      language: updatedUser.language ?? 'en',
      has_completed_onboarding: updatedUser.hasCompletedOnboarding,
      gender: updatedUser.gender ?? null,
      is_admin: true,
      updated_at: new Date().toISOString(),
    };
    await supabase
      .from('profiles')
      .update(data)
      .eq('id', data.id)
      .select()
      .single();
  } catch (err) {
    console.error('Error updating user:', err);
  }
};

export const getUserById = async (userId: string) => {
  try {
    const response = await axios.get('/me');

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
