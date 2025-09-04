import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import {
  Blue,
  Dark,
  Gray3,
  Gray4,
  Gray7,
  LightBlue,
  Red,
  White,
} from '../../theme/colors';
import styled from '../../../styled-components';
import { TextL, TextM, TextS, TextSLight } from '../../theme/typography';
import Spacer from '../../components/spacer/Spacer';
import GlobalIcon from '../../../assets/icons/global.svg';
import GoogleIcon from '../../../assets/icons/google.svg';
import CustomInput from '../../components/input/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../lib/routes/Router';
import useAuth from '../../lib/auth/useAuth';
import MailIcon from '../../../assets/icons/mail.svg';
import ShowPassIcon from '../../../assets/icons/show-pass.svg';
import HidePassIcon from '../../../assets/icons/hide-pass.svg';
import LockIcon from '../../../assets/icons/lock.svg';
import useKeyboardVisible from '../../lib/keyboard/useKeyboardVisible';
import { useTranslation } from 'react-i18next';

const LoginScreen = () => {
  const { t } = useTranslation();
  const { signIn, loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const isKeyboardVisible = useKeyboardVisible();

  const handleLogin = async () => {
    if (!email || !password) {
      setError(true);
      return;
    }
    try {
      setLoading(true);
      await loginUser(email, password);
      // await signIn(response);
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
                    <GoogleIcon width={32} height={32} fill={Red} />
                    <Spacer direction="horizontal" size="xs" />
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
                    onChangeText={setEmail}
                    startIcon={MailIcon}
                  />
                  <Spacer direction="vertical" size="m" />
                  <CustomInput
                    label={t('login_screen.password')}
                    placeholder={t('login_screen.password_placeholder')}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    startIcon={LockIcon}
                    endIcon={showPassword ? ShowPassIcon : HidePassIcon}
                    onPressEndIcon={() => setShowPassword(!showPassword)}
                  />
                  <Spacer direction="vertical" size="xs" />
                  <Pressable
                    onPress={() => navigation.navigate('ForgotPassword')}
                  >
                    <ForgotPasswordLabel>
                      {t('login_screen.forgot_password')}
                    </ForgotPasswordLabel>
                  </Pressable>
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
                      disabled={!email || !password || loading}
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
  ${TextL};
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`;

const Subitle = styled.Text`
  ${TextSLight};
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
  background: ${({ disabled }) => (disabled ? '#A3A3A3' : Dark)};
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

const ForgotPasswordLabel = styled.Text`
  ${TextSLight};
  color: ${Blue};
`;

export default LoginScreen;
