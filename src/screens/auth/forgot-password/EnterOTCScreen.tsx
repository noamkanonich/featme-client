import React, { useState, useRef, useEffect } from 'react';
import { Pressable, TextInput } from 'react-native'; // Import for TextInput
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParams } from '../../../lib/routes/auth/AuthStack';
import { useTranslation } from 'react-i18next';
import LockIcon from '../../../../assets/icons/lock.svg';
import {
  Alert,
  AlertTint,
  Dark,
  Gray1,
  Gray6,
  LightOrange,
  Orange,
  White,
} from '../../../theme/colors';
import Spacer from '../../../components/spacer/Spacer';
import { HeadingM, TextM, TextS } from '../../../theme/typography';
import { css } from 'styled-components';
import NavHeader from '../../../components/header/NavHeader';
import styled from '../../../../styled-components';

const EnterOTCScreen = () => {
  const { t } = useTranslation();
  const [firstDigit, setFirstDigit] = useState('');
  const [secondDigit, setSecondDigit] = useState('');
  const [thirdDigit, setThirdDigit] = useState('');
  const [fourthDigit, setFourthDigit] = useState('');
  const [resendSeconds, setResendSeconds] = useState(60);
  const [otpValid, setOtpValid] = useState(false); // State for OTP validity
  const [error, setError] = useState(false); // State for OTP validity

  const [otpInput, setOtpInput] = useState(''); // Complete OTP code
  // State to track which TextInput is active
  const [activeInput, setActiveInput] = useState<number | null>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParams>>();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (resendSeconds > 0) {
      interval = setInterval(() => {
        setResendSeconds(prev => {
          if (prev > 1) {
            return prev - 1;
          } else {
            clearInterval(interval);
            return 0;
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [resendSeconds]);

  useEffect(() => {
    setOtpInput(firstDigit + secondDigit + thirdDigit + fourthDigit);
  }, [firstDigit, secondDigit, thirdDigit, fourthDigit]);

  useEffect(() => {
    setError(false);

    if (
      firstDigit.length > 0 &&
      secondDigit.length > 0 &&
      thirdDigit.length > 0 &&
      fourthDigit.length > 0
    ) {
      const code =
        firstDigit + '' + secondDigit + '' + thirdDigit + '' + fourthDigit;
      if (code === '1234') {
        // Replace '1234' with the actual logic to validate OTP
        console.log('OTP verified successfully');
        navigation.navigate('ForgotPassword', { screen: 'NewPassword' });
        setOtpValid(true);
        // Navigate to the next screen or show success message
      } else {
        console.log('Invalid OTP');
        setOtpValid(false);
        setError(true);
        // Optionally show an error message to the user
      }
    }
  }, [firstDigit, secondDigit, thirdDigit, fourthDigit, navigation]);

  // Create refs for each TextInput
  const secondInputRef = useRef<TextInput>(null);
  const thirdInputRef = useRef<TextInput>(null);
  const fourthInputRef = useRef<TextInput>(null);

  const handleNumberChange = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    nextRef?: React.RefObject<TextInput>,
  ) => {
    if (/^\d$/.test(value)) {
      setValue(value);
      if (nextRef) {
        nextRef.current?.focus(); // Focus the next TextInput
      }
    } else {
      setValue('');
    }
  };

  const handleFocus = (inputNumber: number) => {
    setActiveInput(inputNumber);
  };

  const handleBlur = () => {
    setActiveInput(null);
  };

  const handleResendCode = async () => {
    console.log('RESEND CODE');
    setResendSeconds(60);
  };

  const handleVerifyOtp = () => {
    // Simulate OTP verification logic
    if (otpInput === '1234') {
      // Replace '1234' with the actual logic to validate OTP
      console.log('OTP verified successfully');
      setOtpValid(true);
      // Navigate to the next screen or show success message
    } else {
      console.log('Invalid OTP');
      setOtpValid(false);
      // Optionally show an error message to the user
    }
  };

  return (
    <Root>
      <NavHeader />
      <Spacer direction="vertical" size="xxl" />
      <Container>
        <UpperContainer>
          <TextRow>
            <Title>{t('forgot_password.otp_code_title')}</Title>
            <Spacer direction="horizontal" size="xxs" />
            <LockIcon width={24} height={24} />
          </TextRow>
          <Spacer direction="vertical" size="s" />
          <CustomText>{t('forgot_password.otp_content')}</CustomText>
          <Spacer direction="vertical" size="xl" />

          <Row>
            <CodeTextInput
              isActive={activeInput === 1}
              value={firstDigit}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={value =>
                handleNumberChange(value, setFirstDigit, secondInputRef)
              }
              error={error}
              onFocus={() => handleFocus(1)}
              onBlur={handleBlur}
            />
            <Spacer direction="horizontal" size="m" />
            <CodeTextInput
              ref={secondInputRef}
              isActive={activeInput === 2}
              value={secondDigit}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={value =>
                handleNumberChange(value, setSecondDigit, thirdInputRef)
              }
              error={error}
              onFocus={() => handleFocus(2)}
              onBlur={handleBlur}
            />
            <Spacer direction="horizontal" size="m" />
            <CodeTextInput
              ref={thirdInputRef}
              isActive={activeInput === 3}
              value={thirdDigit}
              keyboardType="numeric"
              maxLength={1}
              error={error}
              onChangeText={value =>
                handleNumberChange(value, setThirdDigit, fourthInputRef)
              }
              onFocus={() => handleFocus(3)}
              onBlur={handleBlur}
            />
            <Spacer direction="horizontal" size="m" />
            <CodeTextInput
              ref={fourthInputRef}
              isActive={activeInput === 4}
              value={fourthDigit}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={value => handleNumberChange(value, setFourthDigit)}
              onFocus={() => handleFocus(4)}
              error={error}
              onBlur={handleBlur}
            />
          </Row>
          <TextContainer>
            <Spacer direction="vertical" size="xxl-2" />

            <TextRow>
              <Label>{t('forgot_password.resend_timer_prefix')}</Label>
              <Spacer direction="horizontal" size="xxs" />
              <SecondsLabel>{resendSeconds}</SecondsLabel>
              <Spacer direction="horizontal" size="xxs" />
              <Label>{t('forgot_password.seconds')}</Label>
            </TextRow>

            <Spacer direction="vertical" size="xl" />
            <Pressable onPress={handleResendCode} disabled={resendSeconds > 0}>
              <ResendCodeLabel disabled={resendSeconds > 0}>
                {t('forgot_password.resend_code')}
              </ResendCodeLabel>
            </Pressable>
          </TextContainer>
        </UpperContainer>
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

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const UpperContainer = styled.View`
  padding: 20px;
`;

const TextContainer = styled.View`
  align-items: center;
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

const Label = styled.Text`
  ${TextS};
  color: ${Gray1};
`;
const SecondsLabel = styled.Text`
  ${TextS};
  color: ${Orange};
`;

const ResendCodeLabel = styled.Text<{ disabled?: boolean }>`
  ${TextS};
  ${({ disabled }) => `color: ${disabled ? Gray1 : Orange}`};
`;

const CodeTextInput = styled.TextInput<{ isActive?: boolean; error: boolean }>`
  flex: 1;
  width: 64px;
  height: 64px;
  padding: 0;
  border-radius: 8px;
  text-align: center;
  text-align-vertical: center;
  font-size: 24px;
  font-weight: bold;
  color: ${Dark};
  ${({ isActive, error }) => css`
    border: 2px solid ${error ? Alert : isActive ? Orange : Gray6};
    background: ${error ? AlertTint : isActive ? LightOrange : Gray6};
  `};
`;

export default EnterOTCScreen;
