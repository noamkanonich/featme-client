import { IUser } from '../../data/user/IUser';
import { supabase } from '../../lib/supabase/supabase';
import { getUserById } from '../user/user-utils';

export const loginUser = async (email: string, password: string) => {
  try {
    console.log('Attempting to log in with email:', email);
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log('Login response:', response);
    if (response.error) {
      throw new Error(response.error.message);
    }

    const user = await getUserById(response.data.user?.id);
    return user;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const registerUser = async (
  email: string,
  password: string,
  newUser: IUser,
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName: newUser.fullName ?? null,
          phoneNumber: newUser.phoneNumber ?? null,
        },
      },
    });
    console.log('Registration response:', data);
    if (error) {
      throw new Error(error.message);
    }

    console.log('ID of the new user:', data.user?.id);

    const response = await supabase
      .from('profiles')
      .upsert({
        id: data.user?.id || newUser.id,
        full_name: newUser.fullName ?? null,
        email: newUser.email ?? null,
        phone_number: newUser.phoneNumber ?? null,
        date_birth: newUser.dateBirth ?? null,
        language: newUser.language ?? 'en',
        has_completed_onboarding: false,
        gender: newUser.gender ?? null,
        is_admin: true,

        // units: newUser.units ?? 'metric',
        // has_completed_onboarding: false,
        // sex: newUser.sex ?? null,
        // age: newUser.age ?? null,
        // height_cm: newUser.heightCm ?? null,
        // weight_kg: newUser.weightKg ?? null,
        // calories: newUser.calories ?? null,
        // protein_g: newUser.proteinG ?? null,
        // fat_g: newUser.fatG ?? null,
        // carbs_g: newUser.carbsG ?? null,
      })
      .select()
      .single();

    console.log('RESPONSE AFTER REGISTER USER TO DB: ', response);
    const user = {
      id: response.data.id,
      fullName: response.data.full_name,
      email: response.data.email,
      phoneNumber: response.data.phone_number,
      dateBirth: response.data.date_birth,
      gender: response.data.gender,
      language: response.data.language ?? 'en',
      hasCompletedOnboarding: response.data.has_completed_onboarding ?? false,
      isAdmin: response.data.isAdmin || false,
    };
    return user;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};
