import {
  View,
  ScrollView,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState } from 'react';
import styled from '../../../styled-components';
import {
  Gray1,
  Gray4,
  Gray7,
  Green,
  LightGreen,
  White,
} from '../../theme/colors';
import Spacer from '../../components/spacer/Spacer';
import StepIndicator from '../../components/step-indicator/StepIndicator';
import { HeadingXL, Subtitle, TextM, TextSLight } from '../../theme/typography';
import LinearGradient from 'react-native-linear-gradient';
import PulseIcon from '../../../assets/icons/pulse.svg';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { ActivityLevel } from '../../data/ActivityLevel';
import CouchIcon from '../../../assets/icons/couch-icon.svg';
import WalkingManIcon from '../../../assets/icons/man-walking.svg';
import RunningManIcon from '../../../assets/icons/man-running.svg';
import CustomButton from '../../components/buttons/CustomButton';
import { OnboardingStackParamList } from '../../lib/routes/Router';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import ArrowRightIcon from '../../../assets/icons/arrow-right.svg';
import FadeInView from '../../components/animations/FadeInView';

const OnboardingForthScreen = () => {
  const { t } = useTranslation();
  const [activityLevel, setActivityLevel] = useState<
    ActivityLevel | undefined
  >();
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const route =
    useRoute<RouteProp<OnboardingStackParamList, 'OnboardingForth'>>();

  const { unitType, height, weight, gender, dateBirth } = route.params;

  const isRtl = i18n.dir() === 'rtl';
  const ArrowIcon = isRtl ? ArrowRightIcon : ArrowLeftIcon;

  const handleNextScreen = () => {
    navigation.navigate('OnboardingFifth', {
      unitType: unitType,
      height: height,
      weight: weight,
      gender: gender,
      dateBirth: dateBirth || new Date(),
      activityLevel: activityLevel || ActivityLevel.LightlyActive,
    });
  };

  const activeLevels = [
    {
      label: t('onboarding_forth_screen.sedentary_label'),
      description: t('onboarding_forth_screen.sedentary_desc'),
      value: ActivityLevel.Sedentary,
      icon: CouchIcon,
    },
    {
      label: t('onboarding_forth_screen.lightly_active_label'),
      description: t('onboarding_forth_screen.lightly_active_desc'),
      value: ActivityLevel.LightlyActive,
      icon: WalkingManIcon,
    },
    {
      label: t('onboarding_forth_screen.moderately_active_label'),
      description: t('onboarding_forth_screen.moderately_active_desc'),
      value: ActivityLevel.ModeratelyActive,
      icon: RunningManIcon,
    },
    {
      label: t('onboarding_forth_screen.very_active_label'),
      description: t('onboarding_forth_screen.very_active_desc'),
      value: ActivityLevel.VeryActive,
      icon: WalkingManIcon,
    },
    {
      label: t('onboarding_forth_screen.athlete_label'),
      description: t('onboarding_forth_screen.athlete_desc'),
      value: ActivityLevel.Athlete,
      icon: WalkingManIcon,
    },
  ];

  return (
    <Root>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Container>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Spacer direction="vertical" size="xxl-2" />

            <TopContainer>
              <StepIndicator current={3} total={5} />
              <Spacer direction="vertical" size="xxl-2" />
              <IconBox>
                <PulseIcon width={48} height={48} fill={White} />
              </IconBox>

              <TextContainer>
                <Title>{t('onboarding_forth_screen.title')}</Title>
                <Spacer direction="vertical" size="s" />

                <CustomSubtitle>
                  {t('onboarding_forth_screen.subtitle')}
                </CustomSubtitle>
              </TextContainer>
            </TopContainer>
            <ActivityLevelContainer>
              {activeLevels.map(level => {
                const Icon = level.icon;
                return (
                  <>
                    <ActivityLevelItem
                      key={level.value}
                      isActive={activityLevel === level.value}
                      onPress={() => {
                        setActivityLevel(level.value);
                      }}
                    >
                      <IconRow>
                        <Icon width={32} height={32} />
                        <Spacer direction="horizontal" size="xl" />

                        <View>
                          <ActivityLevelLabel>{level.label}</ActivityLevelLabel>

                          <ActivityLevelDescription>
                            {level.description}
                          </ActivityLevelDescription>
                        </View>
                      </IconRow>
                    </ActivityLevelItem>
                    <Spacer direction="vertical" size="m" />
                  </>
                );
              })}
            </ActivityLevelContainer>

            <ButtonsContainer>
              <CustomButton
                label={t('onboarding_forth_screen.next')}
                backgroundColor={Green}
                color={White}
                onPress={handleNextScreen}
              />

              <Spacer direction="vertical" size="m" />

              <Row>
                <BackButtonContainer>
                  <Pressable
                    onPress={() => {
                      navigation.goBack();
                    }}
                  >
                    <IconRow>
                      <ArrowIcon
                        width={24}
                        height={24}
                        fill={Gray1}
                        stroke={Gray1}
                      />
                      <Spacer direction="horizontal" size="s" />

                      <BackButtonLabel>
                        {t('onboarding_forth_screen.back')}
                      </BackButtonLabel>
                    </IconRow>
                  </Pressable>
                </BackButtonContainer>
                <SkipButtonContainer>
                  <Pressable onPress={() => null}>
                    <SkipButtonLabel>
                      {t('onboarding_forth_screen.skip')}
                    </SkipButtonLabel>
                  </Pressable>
                </SkipButtonContainer>
              </Row>
            </ButtonsContainer>
          </ScrollView>
        </Container>
      </KeyboardAvoidingView>
      <Spacer direction="vertical" size="s" />
    </Root>
  );
};

const Root = styled.View`
  flex: 1;
  background: ${Gray7};
`;

const Container = styled.View``;

const TopContainer = styled.View`
  padding: 20px;
  align-items: center;
  justify-content: center;
`;

const TextContainer = styled.View`
  padding: 20px;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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

const ActivityLevelContainer = styled.View`
  flex: 1;
  padding: 0px 20px;
`;

const ButtonsContainer = styled.View`
  flex: 1;
  padding: 20px;
`;

const ActivityLevelItem = styled.Pressable<{ isActive?: boolean }>`
  flex: 1;
  width: 100%;
  border-radius: 16px;
  padding: 20px;
  background: ${({ isActive }) => (isActive ? LightGreen : White)};

  justify-content: flex-start;
  ${({ isActive }) =>
    isActive ? `border: 2px solid ${Green}` : `border: 2px solid ${Gray4}`};
`;

const ActivityLevelLabel = styled.Text`
  ${TextM};
  font-weight: bold;
`;

const ActivityLevelDescription = styled.Text`
  ${TextSLight};
`;

const IconRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const BackButtonContainer = styled.View`
  align-items: center;
  justify-content: flex-end;
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

const BackButtonLabel = styled.Text`
  ${TextSLight};

  font-weight: bold;
  text-align: right;
`;

export default OnboardingForthScreen;
