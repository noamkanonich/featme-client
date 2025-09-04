import React, { useState } from 'react';
import {
  Blue,
  Dark,
  Gray3,
  Gray4,
  Gray7,
  LightBlue,
  White,
} from '../../theme/colors';
import styled from '../../../styled-components';
import { TextL, TextM, TextS, TextSLight } from '../../theme/typography';
import Spacer from '../../components/spacer/Spacer';
import GlobalIcon from '../../../assets/icons/global.svg';
import GoogleIcon from '../../../assets/icons/google.svg';
import CustomInput from '../../components/input/CustomInput';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../lib/routes/Router';
import { loginUser, registerUser } from '../../utils/auth-utils';
import useAuth from '../../lib/auth/useAuth';
import PhoneIcon from '../../../assets/icons/phone.svg';
import AccountIcon from '../../../assets/icons/account.svg';
import MainIcon from '../../../assets/icons/mail.svg';
import LockIcon from '../../../assets/icons/lock.svg';
import ShowPassIcon from '../../../assets/icons/show-pass.svg';
import HidePassIcon from '../../../assets/icons/hide-pass.svg';
import uuid from 'react-native-uuid';
import PasswordStrengthMeter from '../../components/password-strength-meter/PasswordStrengthMeter';
import useKeyboardVisible from '../../lib/keyboard/useKeyboardVisible';
import { useTranslation } from 'react-i18next';

const RegisterScreen = () => {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const isKeyboardVisible = useKeyboardVisible();

  const handleRegister = async () => {
    if (!email || !password) {
      console.log('Email and password are required');
      setError(true);
      return;
    }
    try {
      setLoading(true);
      const newUser = {
        id: uuid.v4() as string,
        fullName,
        phoneNumber,
        email,
        language: 'en',
      };
      const response = await registerUser(email, password, newUser);
      await signIn(response);
      console.log('Register RESPONSE:', response);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <Root>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled={isKeyboardVisible}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <Container>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Spacer direction="vertical" size="xxl" />

            <Card>
              <IconBox>
                <Image
                  source={require('../../../assets/images/logo.png')}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 64,
                  }}
                  resizeMode="cover"
                />
              </IconBox>
              <Spacer direction="vertical" size="m" />
              <Title>{t('register_screen.title')}</Title>
              <Spacer direction="vertical" size="s" />
              <Subitle>{t('register_screen.subtitle')}</Subitle>
              <Spacer direction="vertical" size="xxl-2" />

              <GoogleButtonContainer>
                <IconRow>
                  <GoogleIcon width={32} height={32} fill={Blue} />
                  <Spacer direction="horizontal" size="xs" />
                  <GoogleButtonLabel>
                    {t('register_screen.google_register')}
                  </GoogleButtonLabel>
                </IconRow>
              </GoogleButtonContainer>
              <Spacer direction="vertical" size="m" />

              <Row>
                <Divider />
                <Spacer direction="horizontal" size="m" />
                <CustomText>{t('register_screen.or')}</CustomText>
                <Spacer direction="horizontal" size="m" />
                <Divider />
              </Row>
              <Spacer direction="vertical" size="xs" />

              <InputContainer>
                <CustomInput
                  label={t('register_screen.full_name')}
                  placeholder={t('register_screen.full_name_placeholder')}
                  value={fullName}
                  onChangeText={setFullName}
                  startIcon={AccountIcon}
                />
                <Spacer direction="vertical" size="m" />
                <CustomInput
                  label={t('register_screen.phone')}
                  placeholder={t('register_screen.phone_placeholder')}
                  value={phoneNumber}
                  numeric
                  onChangeText={setPhoneNumber}
                  startIcon={PhoneIcon}
                />
                <Spacer direction="vertical" size="m" />
                <CustomInput
                  label={t('register_screen.email')}
                  placeholder={t('register_screen.email_placeholder')}
                  value={email}
                  onChangeText={setEmail}
                  startIcon={MainIcon}
                />
                <Spacer direction="vertical" size="m" />

                <CustomInput
                  label={t('register_screen.password')}
                  placeholder={t('register_screen.password_placeholder')}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword} // ← היה תמיד true, ולא טוגל
                  startIcon={LockIcon}
                  endIcon={showPassword ? ShowPassIcon : HidePassIcon}
                  onPressEndIcon={() => setShowPassword(!showPassword)}
                />
                <PasswordStrengthMeter password={password} />
                <Spacer direction="vertical" size="m" />

                <CustomInput
                  label={t('register_screen.confirm_password')}
                  placeholder={t(
                    'register_screen.confirm_password_placeholder',
                  )}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword} // ← היה תמיד true, ולא טוגל
                  startIcon={LockIcon}
                  endIcon={showConfirmPassword ? ShowPassIcon : HidePassIcon}
                  onPressEndIcon={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                />
              </InputContainer>
              <Spacer direction="vertical" size="m" />

              <ButtonContainer>
                {loading ? (
                  <ActivityIndicator size={24} color={White} />
                ) : (
                  <Pressable
                    onPress={handleRegister}
                    disabled={!email || !password || loading}
                  >
                    <ButtonLabel>{t('register_screen.register')}</ButtonLabel>
                  </Pressable>
                )}
              </ButtonContainer>
              <Spacer direction="vertical" size="m" />

              <Row>
                <Subitle>{t('register_screen.have_account')}</Subitle>
                <Spacer direction="horizontal" size="xs" />
                <Pressable
                  onPress={() => {
                    navigation.navigate('Login');
                  }}
                >
                  <SignUpLabel>{t('register_screen.login')}</SignUpLabel>
                </Pressable>
              </Row>
            </Card>
          </ScrollView>
        </Container>
      </KeyboardAvoidingView>
    </Root>
  );
};

const Root = styled.View`
  flex: 1;
  background: ${White};
`;

const Container = styled.View`
  padding: 20px;
`;

const Card = styled.View`
  background: ${White};
  border-radius: 16px;

  align-items: center;
`;

const IconBox = styled.View`
  width: 92px;
  height: 92px;
  border-radius: 100px;
  background: ${LightBlue};
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  ${TextL};
  font-size: 20px;
  font-weight: bold;
`;

const Subitle = styled.Text`
  ${TextSLight};
`;

const GoogleButtonContainer = styled.View`
  width: 100%;
  border-radius: 8px;
  background: ${White};
  padding: 10px;
  border: 1px solid ${Gray4};
  align-items: center;
`;

const IconRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const GoogleButtonLabel = styled.Text`
  ${TextM};
`;

const CustomText = styled.Text`
  ${TextSLight};
`;

const Divider = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${Gray3};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const InputContainer = styled.View`
  flex: 1;
  width: 100%;
`;

const ButtonContainer = styled.View`
  width: 100%;
  border-radius: 16px;
  background: ${Dark};
  padding: 16px;
  align-items: center;
  justify-content: center;
`;

const ButtonLabel = styled.Text`
  ${TextM};
  color: ${White};
  font-weight: bold;
`;

const SignUpLabel = styled.Text`
  ${TextSLight};
  color: ${Blue};
  font-weight: bold;
`;

export default RegisterScreen;
