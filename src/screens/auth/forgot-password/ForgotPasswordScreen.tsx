import React, { useState } from 'react';
import KeyIcon from '../../../../assets/icons/key.svg';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParams } from '../../../lib/routes/auth/AuthStack';
import styled from 'styled-components/native';
import { HeadingM, TextM } from '../../../theme/typography';
import Spacer from '../../../components/spacer/Spacer';
import { Gray1, Gray4, Orange, White } from '../../../theme/colors';
import CustomButton from '../../../components/buttons/CustomButton';
import NavHeader from '../../../components/header/NavHeader';
import CustomInput from '../../../components/input/CustomInput';
const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParams>>();

  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      console.log('SEND OTP TO: ', registeredEmail);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    } finally {
      navigation.navigate('ForgotPassword', { screen: 'EnterOTC' });
    }
  };

  return (
    <Root>
      <NavHeader />
      <Spacer direction="vertical" size="xxl" />

      <Container>
        <UpperContainer>
          <TextRow>
            <Title>{t('forgot_password.title')}</Title>
            <Spacer direction="horizontal" size="xxs" />
            <KeyIcon width={32} height={32} />
          </TextRow>
          <Spacer direction="vertical" size="s" />
          <CustomText>{t('forgot_password.content')}</CustomText>
          <Spacer direction="vertical" size="xl" />

          <CustomInput
            label={t('forgot_password.registered_email')}
            value={registeredEmail}
            placeholder="email@example.com"
            onChangeText={(value: string) => {
              setRegisteredEmail(value);
            }}
          />
        </UpperContainer>
        <LowerContainer>
          <Divider />
          <Spacer direction="vertical" size="xs" />

          <ButtonContainer>
            <CustomButton
              label={t('forgot_password.send_otp')}
              type="primary"
              loading={isLoading}
              color={White}
              background={Orange}
              onPress={handleSendOtp}
            />
          </ButtonContainer>
          <Spacer direction="vertical" size="xs" />
        </LowerContainer>
      </Container>
    </Root>
  );
};

const Root = styled.View`
  height: 100%;
  background: ${White};
`;

const Container = styled.View`
  flex: 1;
  justify-content: space-between;
`;

const UpperContainer = styled.View`
  flex: 1;
  padding: 20px;
`;

const LowerContainer = styled.View``;

const Divider = styled.View`
  height: 1px;
  background: ${Gray4};
`;

const ButtonContainer = styled.View`
  padding: 20px;
`;

const TextRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Title = styled.Text`
  ${HeadingM};
`;

const CustomText = styled.Text`
  ${TextM};
  color: ${Gray1};
`;

export default ForgotPasswordScreen;
