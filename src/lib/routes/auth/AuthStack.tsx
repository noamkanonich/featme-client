import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';

import { NavigatorScreenParams } from '@react-navigation/native';
import ForgotPasswordStack, {
  ForgotPasswordStackParams,
} from './forgot-password/ForgotPasswordStack';
import LoginScreen from '../../../screens/auth/LoginScreen';
import RegisterScreen from '../../../screens/auth/RegisterScreen';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeStack, { WelcomeStackParams } from '../welcome/WelcomeStack';

export type AuthStackParams = {
  AuthMain: undefined;
  Welcome: NavigatorScreenParams<WelcomeStackParams>;
  Login: undefined;
  Register: undefined;
  ForgotPassword: NavigatorScreenParams<ForgotPasswordStackParams>;
};

const Stack = createStackNavigator<AuthStackParams>();

const AuthStack = () => {
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(false);

  useEffect(() => {
    const hasSeenWelcomeScreen = async () => {
      const hasSeen = await AsyncStorage.getItem('hasSeenWelcome');
      console.log(hasSeen);
      if (!hasSeen) {
        setHasSeenWelcome(false);
      }
      setHasSeenWelcome(JSON.parse(hasSeen!) as boolean);
    };

    hasSeenWelcomeScreen();
  }, []);

  return (
    <Stack.Navigator initialRouteName={hasSeenWelcome ? 'Login' : 'Welcome'}>
      {!hasSeenWelcome && (
        <Stack.Screen
          name="Welcome"
          component={WelcomeStack}
          options={{ headerShown: false }}
        />
      )}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
