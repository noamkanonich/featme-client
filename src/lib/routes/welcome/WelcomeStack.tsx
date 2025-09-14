import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import WelcomeScreen from '../../../screens/welcome/WelcomeScreen';

export type WelcomeStackParams = {
  WelcomMain: undefined;
  PrivacyPolicy: undefined;
  Terms: undefined;
};

const Stack = createStackNavigator<WelcomeStackParams>();

const WelcomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="WelcomMain">
      <Stack.Screen
        name="WelcomMain"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Terms"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default WelcomeStack;
