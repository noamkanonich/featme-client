import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import { Dark, Gray3, Gray4, Green, Red, White } from '../../theme/colors';
import styled from '../../../styled-components';
import {
  HeadingL,
  TextM,
  TextMLight,
  TextSLight,
} from '../../theme/typography';
import Spacer from '../../components/spacer/Spacer';
import CustomInput from '../../components/input/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuth from '../../lib/auth/useAuth';
import MailIcon from '../../../assets/icons/mail.svg';
import ShowPassIcon from '../../../assets/icons/eye-open.svg';
import HidePassIcon from '../../../assets/icons/eye-close.svg';
import LockIcon from '../../../assets/icons/lock.svg';
import useKeyboardVisible from '../../lib/keyboard/useKeyboardVisible';
import { useTranslation } from 'react-i18next';
import { AuthStackParams } from '../../lib/routes/auth/AuthStack';
import { useToast } from 'react-native-toast-notifications';

const LoginScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { signIn, loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParams>>();

  const isKeyboardVisible = useKeyboardVisible();

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (value.length > 0 && !value.includes('@')) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value.length > 0 && value.length < 5) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const handleLogin = async () => {
    if (emailError || passwordError) {
      setError(true);
      return;
    }

    try {
      setLoading(true);

      const err = await loginUser(email, password);
      if (err) handleErrorMessage(err);
      setLoading(false);
    } catch (err) {
      console.log('Login screen: ', err);
      handleErrorMessage(err as Error);
      setLoading(false);
    }
  };

  const handleErrorMessage = (err: Error) => {
    switch (err.message) {
      case 'auth/network-request-failed':
        toast.show(t('toast.login_screen.error_network'), {
          type: 'danger',
          placement: 'bottom',
          textStyle: { color: Red },
        });

        break;
      case 'auth/invalid-email':
        toast.show(t('toast.login_screen.error_invalid_email'), {
          type: 'danger',
          textStyle: { color: Red },
          placement: 'bottom',
        });

        break;
      case 'auth/user-not-found':
        toast.show(t('toast.login_screen.error_user_not_found'), {
          type: 'danger',
          placement: 'bottom',
          textStyle: { color: Red },
        });
        break;
      case 'auth/invalid-credential':
        toast.show(t('toast.login_screen.invalid_credential'), {
          type: 'danger',
          placement: 'bottom',
          textStyle: { color: Red },
        });

        break;
      default:
        toast.show(err.message, {
          type: 'danger',
          placement: 'bottom',
          textStyle: { color: Red },
        });

        break;
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
              {/* ===== Top content ===== */}
              <CardContent>
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
                <Title>{t('login_screen.title')}</Title>
                <Spacer direction="vertical" size="xs" />
                <Subitle>{t('login_screen.subtitle')}</Subitle>

                <Spacer direction="vertical" size="xxl-2" />
                <GoogleButtonContainer>
                  <IconRow>
                    <Image
                      source={require('../../../assets/images/google.png')}
                      style={{ width: 32, height: 32 }}
                    />
                    {/* <GoogleIcon width={32} height={32} fill={Red} /> */}
                    <Spacer direction="horizontal" size="s" />
                    <GoogleButtonLabel>
                      {t('login_screen.google_login')}
                    </GoogleButtonLabel>
                  </IconRow>
                </GoogleButtonContainer>

                <Spacer direction="vertical" size="m" />
                <Row>
                  <Divider />
                  <Spacer direction="horizontal" size="m" />
                  <CustomText>{t('login_screen.or')}</CustomText>
                  <Spacer direction="horizontal" size="m" />
                  <Divider />
                </Row>

                <Spacer direction="vertical" size="xs" />
                <InputContainer>
                  <CustomInput
                    label={t('login_screen.email')}
                    placeholder={t('login_screen.email_placeholder')}
                    value={email}
                    onChangeText={handleEmailChange}
                    startIcon={MailIcon}
                    dirty={emailError}
                  />
                  <Spacer direction="vertical" size="m" />
                  <CustomInput
                    label={t('login_screen.password')}
                    placeholder={t('login_screen.password_placeholder')}
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                    startIcon={LockIcon}
                    endIcon={showPassword ? ShowPassIcon : HidePassIcon}
                    onPressEndIcon={() => setShowPassword(!showPassword)}
                    dirty={passwordError}
                  />
                  <Spacer direction="vertical" size="xs" />
                  <ForgotPasswordContainer>
                    <Pressable
                      onPress={() =>
                        navigation.navigate('ForgotPassword', {
                          screen: 'ForgotPassowrdMain',
                        })
                      }
                    >
                      <ForgotPasswordLabel>
                        {t('login_screen.forgot_password')}
                      </ForgotPasswordLabel>
                    </Pressable>
                  </ForgotPasswordContainer>
                </InputContainer>
              </CardContent>
              <Spacer direction="vertical" size="m" />

              {/* ===== Bottom actions (stuck to bottom) ===== */}
              <BottomSection>
                <ButtonContainer disabled={!email || !password || loading}>
                  {loading ? (
                    <ActivityIndicator size={24} color={White} />
                  ) : (
                    <Pressable
                      onPress={handleLogin}
                      disabled={
                        passwordError ||
                        emailError ||
                        email.length === 0 ||
                        password.length === 0
                      }
                      style={{ width: '100%', alignItems: 'center' }}
                    >
                      <ButtonLabel>{t('login_screen.login')}</ButtonLabel>
                    </Pressable>
                  )}
                </ButtonContainer>

                <Spacer direction="vertical" size="m" />
                <RowCenter>
                  <Subitle>{t('login_screen.no_account')}</Subitle>
                  <Spacer direction="horizontal" size="xs" />
                  <Pressable onPress={() => navigation.navigate('Register')}>
                    <SignUpLabel>{t('login_screen.register')}</SignUpLabel>
                  </Pressable>
                </RowCenter>
              </BottomSection>
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
  flex: 1;
  padding: 20px;
`;

const Card = styled.View`
  flex: 1;
  border-radius: 16px;
  background: ${White};
`;

const CardContent = styled.View`
  flex: 1;
  width: 100%;
`;
const ForgotPasswordContainer = styled.View`
  flex: 1;
  align-items: flex-start;
`;

const BottomSection = styled.View`
  width: 100%;
`;

const IconBox = styled.View`
  width: 108px;
  height: 108px;
  border-radius: 64px;

  align-items: center;
  justify-content: center;
  align-self: center;
`;

const Title = styled.Text`
  ${HeadingL};
  font-weight: bold;
  text-align: center;
`;

const Subitle = styled.Text`
  ${TextMLight};
  text-align: center;
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

const RowCenter = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const InputContainer = styled.View`
  width: 100%;
`;

const ButtonContainer = styled.View<{ disabled?: boolean }>`
  width: 100%;
  border-radius: 16px;
  background: ${({ disabled }: { disabled: boolean }) =>
    disabled ? '#A3A3A3' : Dark};
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
  color: ${Green};
  font-weight: bold;
`;

const ForgotPasswordLabel = styled.Text`
  ${TextM};
  color: ${Green};
`;

export default LoginScreen;
