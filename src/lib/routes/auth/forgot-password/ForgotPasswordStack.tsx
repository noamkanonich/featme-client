import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import ForgotPasswordScreen from '../../../../screens/auth/forgot-password/ForgotPasswordScreen';
import EnterOTCScreen from '../../../../screens/auth/forgot-password/EnterOTCScreen';
import NewPasswordScreen from '../../../../screens/auth/forgot-password/NewPasswordScreen';

export type ForgotPasswordStackParams = {
  ForgotPassowrdMain: undefined;
  EnterOTC: undefined;
  NewPassword: undefined;
};

const Stack = createStackNavigator<ForgotPasswordStackParams>();

const ForgotPasswordStack = () => {
  return (
    <Stack.Navigator initialRouteName="ForgotPassowrdMain">
      <Stack.Screen
        name="ForgotPassowrdMain"
        component={ForgotPasswordScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EnterOTC"
        component={EnterOTCScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NewPassword"
        component={NewPasswordScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default ForgotPasswordStack;
