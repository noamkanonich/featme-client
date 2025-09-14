export interface IUserRaw {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  date_birth?: Date | string;
  gender?: number;
  language?: string;
  created_at?: Date;
  updated_at?: Date;
  has_completed_onboarding?: boolean;
  is_admin?: boolean;
}
