// import React, { ReactNode, useCallback, useEffect, useState } from 'react';
// import { IUser } from '../../data/IUser';
// import AuthContext from './AuthContext';
// import i18n from '../../i18n';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getUserById, updateUserOnDB } from '../../utils/user-utils';
// import { supabase } from '../supabase/supabase';
// import { setAuthorizationHeader } from '../axios';

// interface AuthProviderProps {
//   children: ReactNode;
//   onReady: (user: IUser | null) => void;
// }

// export const AuthProvider = ({ onReady, children }: AuthProviderProps) => {
//   const [user, setUser] = useState<IUser | undefined>(undefined);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

//   useEffect(() => {
//     console.log('USE EFFECT 1');
//     let mounted = true;

//     (async () => {
//       const { data } = await supabase.auth.getSession();
//       console.log(data);

//       if (!mounted) return;
//       console.log(data.session);
//     })();

//     const { data: sub } = supabase.auth.onAuthStateChange(
//       (_event, newSession) => {
//         if (!mounted) return;
//         setAuthorizationHeader(newSession?.access_token || '');

//         console.log(newSession);
//       },
//     );

//     return () => {
//       mounted = false;
//       sub.subscription.unsubscribe();
//     };
//   }, []);

//   useEffect(() => {
//     (async () => {
//       console.log('USE EFFECT 2');

//       setIsLoading(true);
//       const { data } = await supabase.auth.getSession();
//       const session = data.session;
//       console.log('SESSION: ', data);

//       if (session?.user?.id) {
//         const token = data.session?.access_token;
//         setAuthorizationHeader(token);

//         if (!token || !data.session) {
//           setIsLoading(false);
//           return;
//         }

//         const profile = await getUserById(session.user.id);

//         await i18n.changeLanguage(profile?.language || 'he');

//         console.log('Setting authorization header with token:', token);
//         setUser(profile || undefined);
//         setIsAuthenticated(true);
//         onReady(profile ?? null);
//         setHasCompletedOnboarding(profile?.hasCompletedOnboarding ?? false);
//         setIsLoading(false);
//       } else {
//         setUser(undefined);
//         setIsAuthenticated(false);
//         onReady(null);
//         setIsLoading(false);
//       }
//     })();
//   }, [onReady]);

//   useEffect(() => {
//     const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
//       (async () => {
//         console.log('USE EFFECT 3');

//         if (session?.user?.id) {
//           console.log('FETCH USER FROM AUTH STATE CHANGE');
//           const { data: profile } = await supabase
//             .from('profiles')
//             .select('*')
//             .eq('id', session.user.id)
//             .maybeSingle();
//           setUser(profile || undefined);
//           setIsAuthenticated(true);
//           onReady(profile ?? null);
//         } else {
//           setUser(undefined);
//           setIsAuthenticated(false);
//           onReady(null);
//         }
//       })();
//     });
//     return () => sub.subscription.unsubscribe();
//   }, [onReady]);

//   const signIn = useCallback(
//     async (userData?: IUser) => {
//       if (isAuthenticated) return;
//       if (!userData) {
//         console.error('No user data provided for sign-in.');
//         return;
//       }
//       try {
//         await i18n.changeLanguage(userData.language || 'en');
//         await AsyncStorage.setItem('language', userData.language || 'en');
//         if (userData.id) await AsyncStorage.setItem('userId', userData.id);
//         setUser(userData);
//         setIsAuthenticated(true);
//         onReady(userData);
//         console.log(userData.hasCompletedOnboarding);
//         setHasCompletedOnboarding(!!userData.hasCompletedOnboarding);
//       } catch (err) {
//         console.error('Error during sign-in:', err);
//       }
//     },
//     [isAuthenticated, onReady],
//   );

//   const signOut = useCallback(async () => {
//     try {
//       await supabase.auth.signOut(); // ensure session is cleared
//       setIsAuthenticated(false);
//       setUser(undefined);
//       onReady(null);
//     } catch (err) {
//       console.error('Could not logout:', err);
//     }
//   }, [onReady]);

//   const updateUser = useCallback(
//     async (newUser: IUser | undefined) => {
//       if (!newUser) {
//         setUser(undefined);
//         onReady(null);
//         return;
//       }
//       await updateUserOnDB(newUser);
//       setUser(newUser);
//       onReady(newUser);
//     },
//     [onReady],
//   );

//   return (
//     <AuthContext.Provider
//       value={{
//         updateUser,
//         user,
//         signIn,
//         signOut,
//         isSignedIn: isAuthenticated,
//         isLoading,
//         hasCompletedOnboarding,
//         setHasCompletedOnboarding,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import AuthContext from './AuthContext';
import i18n from '../../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from '../../data/IUser';
import { getUserById } from '../../utils/user-utils';
import { supabase } from '../supabase/supabase';
import { setAuthorizationHeader } from '../axios';
import axios from 'axios';

interface AuthProviderProps {
  children: ReactNode;
  onReady: (user: IUser | null) => void;
}

export const AuthProvider = ({ onReady, children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Prevent handling the exact same session repeatedly (e.g., initial + subscription)
  const lastAuthKeyRef = useRef<string | null>(null);

  // Central session handler
  const applySession = useCallback(
    async (
      session: Awaited<
        ReturnType<typeof supabase.auth.getSession>
      >['data']['session'],
    ) => {
      // Create a key that changes when either user or token changes
      const key = session?.user?.id
        ? `${session.user.id}:${session.access_token ?? ''}`
        : 'none';

      console.log(key);

      if (lastAuthKeyRef.current === key) return; // dedupe
      lastAuthKeyRef.current = key;

      setIsLoading(true);

      if (session?.user?.id) {
        const token = session.access_token ?? '';
        setAuthorizationHeader(token);

        const profile = await getUserById(session.user.id);
        await i18n.changeLanguage(profile?.language || 'he');

        setUser(profile || undefined);
        setIsAuthenticated(true);
        setHasCompletedOnboarding(!!profile?.hasCompletedOnboarding);
        onReady(profile ?? null);
      } else {
        // No session
        setAuthorizationHeader('');
        setUser(undefined);
        setIsAuthenticated(false);
        setHasCompletedOnboarding(false);
        onReady(null);
      }

      setIsLoading(false);
    },
    [onReady],
  );

  // Single effect: initialize once + subscribe to changes
  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!mounted) return;

      const { data } = await supabase.auth.getSession();

      await applySession(data.session);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [applySession]);

  // Actions
  const signIn = useCallback(
    async (userData?: IUser) => {
      if (isAuthenticated || !userData) return;

      try {
        await i18n.changeLanguage(userData.language || 'en');
        await AsyncStorage.setItem('language', userData.language || 'en');
        if (userData.id) await AsyncStorage.setItem('userId', userData.id);

        setUser(userData);
        setIsAuthenticated(true);
        setHasCompletedOnboarding(!!userData.hasCompletedOnboarding);
        onReady(userData);
      } catch (err) {
        console.error('Error during sign-in:', err);
      }
    },
    [isAuthenticated, onReady],
  );

  const loginUser = async (email: string, password: string): Promise<void> => {
    try {
      console.log('Logging in with email:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return;
      }
      console.log(data);
      // const response = await axios.post('/auth/login', { email, password });
      // console.log('RESPONSE LOGIN - AUTH PROVIDER: ', response);
      if (!data?.session?.access_token) {
        console.error('No access token in login response');
        return;
      }

      const token = data.session.access_token;
      setAuthorizationHeader(token);

      try {
        const userResponse = await axios.get('/me');
        setUser(userResponse.data);
        await i18n.changeLanguage(userResponse.data.language || 'en');
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to fetch user profile:', e);
        return;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setAuthorizationHeader('');
      setIsAuthenticated(false);
      setUser(undefined);
      setHasCompletedOnboarding(false);
      onReady(null);
      // Clear dedupe so next real session gets processed
      lastAuthKeyRef.current = null;
    } catch (err) {
      console.error('Could not logout:', err);
    }
  }, [onReady]);

  const updateUser = useCallback(
    async (newUser: IUser | undefined) => {
      if (!newUser) {
        setUser(undefined);
        onReady(null);
        return;
      }
      // await updateUserOnDB(newUser);
      await axios.put('/me', newUser);
      setUser(newUser);
      onReady(newUser);
      setIsLoading(false);
    },
    [onReady],
  );

  return (
    <AuthContext.Provider
      value={{
        updateUser,
        user,
        signIn,
        loginUser,
        signOut,
        isSignedIn: isAuthenticated,
        isLoading,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
