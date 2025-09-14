// src/lib/routes/Router.tsx
import React, { useEffect, useState } from 'react';
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './tab-navigator/TabNavigator';
import useAuth from '../auth/useAuth';
import OnboardingFirstScreen from '../../screens/onboarding/OnboardingFirstScreen';
import OnboardingSecondScreen from '../../screens/onboarding/OnboardingSecondScreen';
import { UnitType } from '../../data/UnitType';
import OnboardingThirdScreen from '../../screens/onboarding/OnboardingThirdScreen';
import OnboardingForthScreen from '../../screens/onboarding/OnboardingForthScreen';
import { Gender } from '../../data/user/IUser';
import OnboardingFifthScreen from '../../screens/onboarding/OnboardingFifthScreen';
import { ActivityLevel } from '../../data/ActivityLevel';
import OnboardingFinalScreen from '../../screens/onboarding/OnboardingFinalScreen';
import { UserGoal } from '../../data/UserGoal';
import { Dark, LightGreen, Green, Red, LightRed } from '../../theme/colors';
import LoadingScreen from '../../screens/loading/LoadingScreen';
import CheckCircleIcon from '../../../assets/icons/check-circle.svg';
import CloseCircleIcon from '../../../assets/icons/close-circle.svg';

import { ToastProvider } from 'react-native-toast-notifications';
import AuthStack, { AuthStackParams } from './auth/AuthStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RootStackParamList = {
  TabNavigator: undefined;
};

export type OnboardingStackParamList = {
  OnboardingFirst: undefined;
  OnboardingSecond: undefined;
  OnboardingThird:
    | { unitType: UnitType; height: number; weight: number }
    | undefined;
  OnboardingForth:
    | {
        unitType: UnitType;
        height: number;
        weight: number;
        gender: Gender;
        dateBirth: string | number | Date;
      }
    | undefined;
  OnboardingFifth:
    | {
        unitType: UnitType;
        height: number;
        weight: number;
        gender: Gender;
        dateBirth: string | number | Date;
        activityLevel: ActivityLevel;
      }
    | undefined;
  OnboardingFinal:
    | {
        unitType: UnitType;
        height: number;
        weight: number;
        gender: Gender;
        dateBirth: string | number | Date;
        activityLevel: ActivityLevel;
        userGoal: UserGoal;
      }
    | undefined;
};

export type AuthRootStackParams = {
  Auth: NavigatorScreenParams<AuthStackParams>;
};

const AuthRootStack = createNativeStackNavigator<AuthRootStackParams>();

const RootStack = createNativeStackNavigator<RootStackParamList>();

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

const Router = () => {
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(false);
  const { isSignedIn, hasCompletedOnboarding, isLoading } = useAuth();

  useEffect(() => {
    const hasSeenWelcomeScreen = async () => {
      const hasSeen = await AsyncStorage.getItem('hasSeenWelcome');
      if (!hasSeen) {
        setHasSeenWelcome(false);
      }
      setHasSeenWelcome(JSON.parse(hasSeen!) as boolean);
    };

    hasSeenWelcomeScreen();
  }, []);

  useEffect(() => {
    console.log(
      '✅ Router mounted',
      isSignedIn,
      hasCompletedOnboarding,
      isLoading,
    );
  }, [hasCompletedOnboarding, isSignedIn, isLoading]);

  if (isLoading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <ToastProvider
        placement="bottom"
        duration={5000}
        animationType="slide-in"
        animationDuration={250}
        successColor={LightGreen}
        dangerColor={LightRed}
        successIcon={<CheckCircleIcon width={24} height={24} stroke={Green} />}
        dangerIcon={<CloseCircleIcon width={24} height={24} stroke={Red} />}
        normalColor={Dark}
        textStyle={{
          fontSize: 16,
          fontWeight: '400',
          color: Dark,
        }}
        offset={150}
        offsetTop={100}
        offsetBottom={75}
        swipeEnabled={true}
      >
        {!isSignedIn ? (
          <AuthRootStack.Navigator initialRouteName="Auth">
            <AuthRootStack.Screen
              name="Auth"
              component={AuthStack}
              options={{ headerShown: false, gestureEnabled: false }}
            />
          </AuthRootStack.Navigator>
        ) : !hasCompletedOnboarding && isSignedIn ? (
          <OnboardingStack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <OnboardingStack.Screen
              name="OnboardingFirst"
              component={OnboardingFirstScreen}
            />
            <OnboardingStack.Screen
              name="OnboardingSecond"
              component={OnboardingSecondScreen}
            />
            <OnboardingStack.Screen
              name="OnboardingThird"
              component={OnboardingThirdScreen}
            />
            <OnboardingStack.Screen
              name="OnboardingForth"
              component={OnboardingForthScreen}
            />
            <OnboardingStack.Screen
              name="OnboardingFifth"
              component={OnboardingFifthScreen}
            />
            <OnboardingStack.Screen
              name="OnboardingFinal"
              component={OnboardingFinalScreen}
            />
          </OnboardingStack.Navigator>
        ) : (
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="TabNavigator" component={TabNavigator} />
          </RootStack.Navigator>
        )}
      </ToastProvider>
    </NavigationContainer>
  );
};

export default Router;
