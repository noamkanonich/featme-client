export interface IUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateBirth?: Date | string;
  gender?: Gender;
  language?: string;
  createdAt?: Date;
  updatedAt?: Date;
  hasCompletedOnboarding?: boolean;
  isAdmin?: boolean;
}

export enum Gender {
  Female = 0,
  Male,
  Other,
}

export enum Role {
  User = 0,
  Admin,
}
