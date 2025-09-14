import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import PrivacyPolicyScreen from '../../../screens/privacy-policy/PrivacyPolicyScreen';
import ProfileScreen from '../../../screens/profile/ProfileScreen';
import SettingsScreen from '../../../screens/settings/SettingsScreen';

export type ProfileStackParams = {
  ProfileMain: undefined;
  Settings: undefined;
  PrivacyPolicy: undefined;
  Terms: undefined;
};

const Stack = createStackNavigator<ProfileStackParams>();

const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName="ProfileMain">
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Terms"
        component={PrivacyPolicyScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
