import {
  View,
  Text,
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
import {
  HeadingL,
  HeadingXL,
  Subtitle,
  TextM,
  TextSLight,
} from '../../theme/typography';
import LinearGradient from 'react-native-linear-gradient';
import TargetIcon from '../../../assets/icons/target.svg';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import CouchIcon from '../../../assets/icons/couch-icon.svg';
import WalkingManIcon from '../../../assets/icons/man-walking.svg';
import RunningManIcon from '../../../assets/icons/man-running.svg';
import CustomButton from '../../components/buttons/CustomButton';
import { OnboardingStackParamList } from '../../lib/routes/Router';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import ArrowRightIcon from '../../../assets/icons/arrow-right.svg';
import { UserGoal } from '../../data/UserGoal';

const OnboardingFifthScreen = () => {
  const { t } = useTranslation();
  const [userGoal, setUserGoal] = useState<UserGoal | undefined>();
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const route =
    useRoute<RouteProp<OnboardingStackParamList, 'OnboardingFifth'>>();

  const { unitType, height, weight, gender, dateBirth, activityLevel } =
    route.params;

  const isRtl = i18n.dir() === 'rtl';
  const ArrowIcon = isRtl ? ArrowRightIcon : ArrowLeftIcon;

  const handleNextScreen = () => {
    navigation.navigate('OnboardingFinal', {
      unitType: unitType,
      height: height,
      weight: weight,
      gender: gender,
      dateBirth: dateBirth || new Date(),
      activityLevel: activityLevel,
      userGoal: userGoal || UserGoal.MaintainWeight,
    });
  };

  const userGoals = [
    {
      label: t('onboarding_fifth_screen.lose_fat_label'),
      description: t('onboarding_fifth_screen.lose_fat_desc'),
      value: UserGoal.LoseFat,
      icon: CouchIcon,
    },
    {
      label: t('onboarding_fifth_screen.maintain_weight_label'),
      description: t('onboarding_fifth_screen.maintain_weight_desc'),
      value: UserGoal.MaintainWeight,
      icon: WalkingManIcon,
    },
    {
      label: t('onboarding_fifth_screen.gain_muscle_label'),
      description: t('onboarding_fifth_screen.gain_muscle_desc'),
      value: UserGoal.GainMuscle,
      icon: RunningManIcon,
    },
  ];

  return (
    <Root>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Container>
          {/* תוכן גליל */}
          <Content>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 16 }} // אופציונלי: רווח קטן בסוף הגלילה
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Spacer direction="vertical" size="xxl-2" />

              <TopContainer>
                <StepIndicator current={4} total={5} />
                <Spacer direction="vertical" size="xxl-2" />
                <IconBox>
                  <TargetIcon width={48} height={48} fill={White} />
                </IconBox>

                <TextContainer>
                  <Title>{t('onboarding_fifth_screen.title')}</Title>
                  <Spacer direction="vertical" size="s" />
                  <CustomSubtitle>
                    {t('onboarding_fifth_screen.subtitle')}
                  </CustomSubtitle>
                </TextContainer>
              </TopContainer>

              <UserGoalContainer>
                {userGoals.map(goal => {
                  const Icon = goal.icon;
                  const isActive = userGoal === goal.value;
                  return (
                    <React.Fragment key={goal.value}>
                      <UserGoalItem
                        isActive={isActive}
                        onPress={() => setUserGoal(goal.value)}
                      >
                        <IconRow>
                          <Icon width={32} height={32} />
                          <Spacer direction="horizontal" size="xl" />
                          <View>
                            <UserGoalLabel>{goal.label}</UserGoalLabel>
                            <UserGoalDescription>
                              {goal.description}
                            </UserGoalDescription>
                          </View>
                        </IconRow>
                      </UserGoalItem>
                      <Spacer direction="vertical" size="m" />
                    </React.Fragment>
                  );
                })}
              </UserGoalContainer>
            </ScrollView>
          </Content>

          {/* כפתורים מוצמדים לתחתית */}
          <ButtonsContainer>
            <CustomButton
              label={t('onboarding_fifth_screen.next')}
              backgroundColor={Green}
              color={White}
              onPress={handleNextScreen}
            />
            <Spacer direction="vertical" size="m" />
            <Row>
              <BackButtonContainer>
                <Pressable onPress={() => navigation.goBack()}>
                  <IconRow>
                    <ArrowIcon
                      width={24}
                      height={24}
                      fill={Gray1}
                      stroke={Gray1}
                    />
                    <Spacer direction="horizontal" size="s" />
                    <BackButtonLabel>
                      {t('onboarding_fifth_screen.back')}
                    </BackButtonLabel>
                  </IconRow>
                </Pressable>
              </BackButtonContainer>
              <SkipButtonContainer>
                <Pressable onPress={() => null}>
                  <SkipButtonLabel>
                    {t('onboarding_fifth_screen.skip')}
                  </SkipButtonLabel>
                </Pressable>
              </SkipButtonContainer>
            </Row>
          </ButtonsContainer>
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

const Container = styled.View`
  flex: 1;
`;

const Content = styled.View`
  flex: 1; /* הגלילה ממלאת את כל השטח שמעל הפוטר */
`;

const ButtonsContainer = styled.View`
  width: 100%;
  padding: 0 20px 20px; /* רווח תחתון קטן */
  /* לא לשים flex: 1 כדי שלא יתפוס גובה! */
`;

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

const UserGoalContainer = styled.View`
  flex: 1;
  padding: 0px 20px;
`;

const UserGoalItem = styled.Pressable<{ isActive?: boolean }>`
  flex: 1;
  width: 100%;
  border-radius: 16px;
  padding: 20px;
  background: ${({ isActive }) => (isActive ? LightGreen : White)};

  justify-content: flex-start;
  ${({ isActive }) =>
    isActive ? `border: 2px solid ${Green}` : `border: 2px solid ${Gray4}`};
`;

const UserGoalLabel = styled.Text`
  ${TextM};
  font-weight: bold;
`;

const UserGoalDescription = styled.Text`
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

export default OnboardingFifthScreen;
