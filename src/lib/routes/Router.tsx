// src/lib/routes/Router.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './tab-navigator/TabNavigator';
import AddFoodScreen from '../../screens/add-food/AddFoodScreen';
import LoginScreen from '../../screens/auth/LoginScreen';
import RegisterScreen from '../../screens/auth/RegisterScreen';
import useAuth from '../auth/useAuth';
import OnboardingFirstScreen from '../../screens/onboarding/OnboardingFirstScreen';
import OnboardingSecondScreen from '../../screens/onboarding/OnboardingSecondScreen';
import { UnitType } from '../../data/UnitType';
import OnboardingThirdScreen from '../../screens/onboarding/OnboardingThirdScreen';
import OnboardingForthScreen from '../../screens/onboarding/OnboardingForthScreen';
import { Gender } from '../../data/IUser';
import OnboardingFifthScreen from '../../screens/onboarding/OnboardingFifthScreen';
import { ActivityLevel } from '../../data/ActivityLevel';
import OnboardingFinalScreen from '../../screens/onboarding/OnboardingFinalScreen';
import i18n from '../../i18n';
import { UserGoal } from '../../data/UserGoal';
import { ActivityIndicator } from 'react-native';
import {
  Dark,
  StatusResolved,
  LightGreen,
  Green,
  Red,
  White,
  LightRed,
} from '../../theme/colors';
import LoadingScreen from '../../screens/loading/LoadingScreen';
import CheckCircleIcon from '../../../assets/icons/check-circle.svg';
import CloseCircleIcon from '../../../assets/icons/close-circle.svg';

import { ToastProvider } from 'react-native-toast-notifications';
import CustomTopBar from '../../components/custom-top-bar/CustomTopBar';

export type RootStackParamList = {
  TabNavigator: undefined;
  // AddFood: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
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

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

const Router = () => {
  const { isSignedIn, hasCompletedOnboarding, isLoading } = useAuth();

  const isRtl = i18n.dir() === 'rtl';

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
          <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
          </AuthStack.Navigator>
        ) : !hasCompletedOnboarding ? (
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
