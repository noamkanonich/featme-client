import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingFirstScreen from '../../../screens/onboarding/OnboardingFirstScreen';
import OnboardingSecondScreen from '../../../screens/onboarding/OnboardingSecondScreen';
import OnboardingThirdScreen from '../../../screens/onboarding/OnboardingThirdScreen';
import OnboardingForthScreen from '../../../screens/onboarding/OnboardingForthScreen';
import OnboardingFifthScreen from '../../../screens/onboarding/OnboardingFifthScreen';
import OnboardingFinalScreen from '../../../screens/onboarding/OnboardingFinalScreen';

import { ActivityLevel } from '../../../data/ActivityLevel';
import { Gender } from '../../../data/user/IUser';
import { UnitType } from '../../../data/UnitType';
import { UserGoal } from '../../../data/UserGoal';

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

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const OnboardingStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="OnboardingFirst"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="OnboardingFirst" component={OnboardingFirstScreen} />
      <Stack.Screen
        name="OnboardingSecond"
        component={OnboardingSecondScreen}
      />
      <Stack.Screen name="OnboardingThird" component={OnboardingThirdScreen} />
      <Stack.Screen name="OnboardingForth" component={OnboardingForthScreen} />
      <Stack.Screen name="OnboardingFifth" component={OnboardingFifthScreen} />
      <Stack.Screen name="OnboardingFinal" component={OnboardingFinalScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingStack;
