import { ScrollView, Pressable } from 'react-native';
import React from 'react';
import styled from 'styled-components/native';
import { Gray1, Gray7, Green, Red, White } from '../../theme/colors';
import LinearGradient from 'react-native-linear-gradient';
import AnalyzedIcon from '../../../assets/icons/analyze.svg';
import { StepIndicator } from '../../components/step-indicator/StepIndicator';
import Spacer from '../../components/spacer/Spacer';
import { HeadingXL, Subtitle, TextM, TextSLight } from '../../theme/typography';
import { useTranslation } from 'react-i18next';
import { OnboardingStackParamList } from '../../lib/routes/Router';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/buttons/CustomButton';

const OnboardingFirstScreen = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  return (
    <Root>
      {/* אזור תוכן גליל */}
      <Content>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          <Spacer direction="vertical" size="xl" />

          <TopContainer>
            <StepIndicator current={1} total={5} />
            <Spacer direction="vertical" size="xxl-2" />

            <IconBox>
              <AnalyzedIcon width={48} height={48} fill={White} />
            </IconBox>

            <TextContainer>
              <Title>{t('onboarding_first_screen.title')}</Title>
              <Spacer direction="vertical" size="m" />
              <CustomSubtitle>
                {t('onboarding_first_screen.subtitle')}
              </CustomSubtitle>
            </TextContainer>

            <Spacer direction="vertical" size="m" />

            <BigIconBox>
              <AnalyzedIcon width={64} height={64} fill={White} />
            </BigIconBox>

            <Spacer direction="vertical" size="xxl-2" />

            <TextRowsContainer>
              <IconRow>
                <IconRowContainer>
                  <AnalyzedIcon width={24} height={24} fill={Red} />
                </IconRowContainer>
                <Spacer direction="horizontal" size="s" />
                <CustomText>
                  {t('onboarding_first_screen.bullet_personalized')}
                </CustomText>
              </IconRow>

              <Spacer direction="vertical" size="m" />

              <IconRow>
                <IconRowContainer>
                  <AnalyzedIcon width={24} height={24} fill={Red} />
                </IconRowContainer>
                <Spacer direction="horizontal" size="s" />
                <CustomText>
                  {t('onboarding_first_screen.bullet_ai')}
                </CustomText>
              </IconRow>

              <Spacer direction="vertical" size="m" />

              <IconRow>
                <IconRowContainer>
                  <AnalyzedIcon width={24} height={24} fill={Red} />
                </IconRowContainer>
                <Spacer direction="horizontal" size="s" />
                <CustomText>
                  {t('onboarding_first_screen.bullet_track')}
                </CustomText>
              </IconRow>
            </TextRowsContainer>
          </TopContainer>
        </ScrollView>
      </Content>

      {/* פוטר קבוע בתחתית */}
      <ButtonsContainer>
        <CustomButton
          label={t('onboarding_first_screen.start')}
          backgroundColor={Green}
          color={White}
          onPress={() => navigation.navigate('OnboardingSecond')}
        />
        <Spacer direction="vertical" size="xs" />
        <SkipButtonContainer>
          <Pressable onPress={() => null}>
            <SkipButtonLabel>
              {t('onboarding_first_screen.skip_for_now')}
            </SkipButtonLabel>
          </Pressable>
        </SkipButtonContainer>
      </ButtonsContainer>
    </Root>
  );
};

const Root = styled.View`
  flex: 1;
  background: ${Gray7};
`;

const Content = styled.View`
  flex: 1; /* הגלילה תופסת את כל החלל שמעל הכפתורים */
`;

const TopContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const TextContainer = styled.View`
  padding: 20px;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const BigIconBox = styled(LinearGradient).attrs({
  colors: ['#34D399', '#8bcdb7'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
})`
  width: 120px;
  height: 120px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;

  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const IconBox = styled(LinearGradient).attrs({
  colors: ['#34D399', '#8bcdb7'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
})`
  width: 85px;
  height: 85px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;

  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const Title = styled.Text`
  ${HeadingXL};
  font-weight: bold;
  text-align: center;
`;

const CustomSubtitle = styled(Subtitle)`
  ${TextM};
  color: ${Gray1};
  text-align: center;
`;

const IconRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const CustomText = styled.Text`
  ${TextM};
`;

const TextRowsContainer = styled.View`
  width: 100%;
  align-items: flex-start;
  justify-content: flex-start;
`;

const SkipButtonContainer = styled.View`
  align-items: center;
  justify-content: flex-end;
`;

const SkipButtonLabel = styled.Text`
  ${TextSLight};
  font-weight: bold;
  text-align: right;
`;

const ButtonsContainer = styled.View`
  width: 100%;
  padding: 0 20px 20px; /* רווח תחתון כדי שלא יידבק לשפת המסך */
  background: transparent;
`;

const IconRowContainer = styled.View`
  background: ${Green};
  padding: 12px;
  border-radius: 32px;
`;

export default OnboardingFirstScreen;
