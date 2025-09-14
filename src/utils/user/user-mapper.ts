import { IUser } from '../../data/user/IUser';
import { IUserRaw } from '../../data/user/IUserRaw';

export const toUser = (raw: IUserRaw): IUser => {
  return {
    id: raw.id,
    fullName: raw.full_name,
    email: raw.email,
    phoneNumber: raw.phone_number,
    dateBirth: raw.date_birth,
    gender: raw.gender,
    language: raw.language ?? 'en',
    hasCompletedOnboarding: raw.has_completed_onboarding ?? false,
    createdAt: raw.created_at ?? undefined,
    updatedAt: raw.updated_at ?? undefined,
  };
};

export const toUserRaw = (user: IUser): IUserRaw => {
  return {
    id: user.id,
    full_name: user.fullName,
    email: user.email,
    phone_number: user.phoneNumber,
    date_birth: user.dateBirth,
    gender: user.gender,
    language: user.language,
    has_completed_onboarding: user.hasCompletedOnboarding ?? false,
    created_at: user.createdAt ?? undefined,
    updated_at: user.updatedAt ?? undefined,
  };
};
