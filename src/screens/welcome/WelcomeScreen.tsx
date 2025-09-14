import { View, Text, Pressable } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WelcomeStackParams } from '../../lib/routes/welcome/WelcomeStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParams } from '../../lib/routes/auth/AuthStack';

const WelcomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<WelcomeStackParams>>();

  const authNavigation =
    useNavigation<NativeStackNavigationProp<AuthStackParams>>();

  useEffect(() => {
    const checkHasSeenWelcome = async () => {
      const hasSeen = await AsyncStorage.getItem('hasSeenWelcome');
      console.log('hasSeen', hasSeen);
      if (!JSON.parse(hasSeen!)) {
        authNavigation.navigate('Login');
      }
    };

    checkHasSeenWelcome();
  }, [authNavigation]);

  const handleSubmit = async () => {
    await AsyncStorage.setItem('hasSeenWelcome', JSON.stringify(true));
    authNavigation.navigate('Login');
  };

  return (
    <View>
      <Text>WelcomeScreen</Text>
      <Pressable
        onPress={() => {
          navigation.navigate('Terms');
        }}
      >
        <Text>Terms</Text>
      </Pressable>

      <Pressable
        onPress={() => {
          navigation.navigate('PrivacyPolicy');
        }}
      >
        <Text>Privacy Policy</Text>
      </Pressable>
    </View>
  );
};

export default WelcomeScreen;
