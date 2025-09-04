import { createContext } from 'react';
import { IUser } from '../../data/IUser';

interface IAuthContext {
  user: IUser | undefined;
  updateUser: (user: IUser | undefined) => Promise<void>;
  signIn: (user?: IUser) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isSignedIn: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export default AuthContext;
