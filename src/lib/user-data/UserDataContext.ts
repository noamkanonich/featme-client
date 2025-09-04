import { createContext } from 'react';

import { IUserGoals } from '../../data/IUserGoals';
import { IUserSettings } from '../../data/IUserSettings';
import { IMeal } from '../../data/meals/IMeal';

interface IUserDataContext {
  meals: IMeal[] | null; // Array of meal IDs or null if not loaded
  setMeals: (newMeals: IMeal[]) => void;
  userGoals: IUserGoals | null;
  setUserGoals: (goals: IUserGoals) => void;
  userSettings: IUserSettings | null;
  setUserSettings: (settings: IUserSettings) => void;
  updateUserSettings: (patch: Partial<IUserSettings>) => Promise<void>;
  updateUserGoals: (patch: Partial<IUserGoals>) => Promise<void>;
  refreshData: () => Promise<void>;
  loading: boolean;
}

const UserDataContext = createContext<IUserDataContext>({} as IUserDataContext);

export default UserDataContext;
