import {
  ScrollView,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Easing,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import styled from '../../../styled-components';
import {
  Blue,
  Gray1,
  Gray4,
  Gray7,
  Green,
  LightGreen,
  Orange,
  Purple,
  White,
} from '../../theme/colors';
import Spacer from '../../components/spacer/Spacer';
import StepIndicator from '../../components/step-indicator/StepIndicator';
import {
  HeadingM,
  HeadingXL,
  Subtitle,
  TextM,
  TextSLight,
} from '../../theme/typography';
import LinearGradient from 'react-native-linear-gradient';
import TrophyIcon from '../../../assets/icons/trophy.svg';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import CustomButton from '../../components/buttons/CustomButton';
import { OnboardingStackParamList } from '../../lib/routes/Router';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import ArrowRightIcon from '../../../assets/icons/arrow-right.svg';
import {
  calculateDailyTargets,
  createUserGoalsByUserId,
} from '../../utils/user-goals/user-goals-utils';
import useAuth from '../../lib/auth/useAuth';

import uuid from 'react-native-uuid';
import { RootTabParamList } from '../../lib/routes/tab-navigator/TabNavigator';
import { UnitType } from '../../data/UnitType';
import useUserData from '../../lib/user-data/useUserData';
import { updateUserOnDB } from '../../utils/user/user-utils';

const STAGGER_MS = 120;
const DURATION_MS = 350;
const START_OFFSET = 18;

const OnboardingFinalScreen = () => {
  const { user, setHasCompletedOnboarding } = useAuth();
  const { refreshData } = useUserData();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootTabParamList>>();

  const route =
    useRoute<RouteProp<OnboardingStackParamList, 'OnboardingFinal'>>();

  const {
    unitType,
    height,
    weight,
    gender,
    dateBirth,
    activityLevel,
    userGoal,
  } = route.params;

  const dailyTargets = calculateDailyTargets({
    unitType,
    height,
    weight,
    gender,
    dateBirth,
    activityLevel,
    goal: userGoal,
  });

  const isRtl = i18n.dir() === 'rtl';
  const ArrowIcon = isRtl ? ArrowRightIcon : ArrowLeftIcon;

  const handleSubmitOnboarding = async () => {
    try {
      setIsLoading(true);

      await createUserGoalsByUserId(user!.id, {
        id: uuid.v4() as string,
        weight: weight,
        height: height,
        userGoal: userGoal,
        activityLevel: activityLevel,
        preferredUnits: unitType ?? UnitType.Metric,
        dailyTargets: dailyTargets,
      });

      console.log('FINISH CREATING USER GOLAS');

      await updateUserOnDB({
        ...user!,
        dateBirth: dateBirth,
        gender: gender,
        hasCompletedOnboarding: true,
        isAdmin: true,
      });

      console.log('FINISH UPDATING USER');

      refreshData();
      setHasCompletedOnboarding(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Error during onboarding submission:', err);
      setIsLoading(false);
    }
  };

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacities = useRef(
    [...Array(4)].map(() => new Animated.Value(0)),
  ).current;
  const cardTranslateY = useRef(
    [...Array(4)].map(() => new Animated.Value(START_OFFSET)),
  ).current;

  useEffect(() => {
    Animated.timing(screenOpacity, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        const seq = cardOpacities.map((_, i) =>
          Animated.parallel([
            Animated.timing(cardOpacities[i], {
              toValue: 1,
              duration: DURATION_MS,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(cardTranslateY[i], {
              toValue: 0,
              duration: DURATION_MS,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]),
        );
        Animated.stagger(STAGGER_MS, seq).start();
      });
    });
  }, [screenOpacity, headerOpacity, cardOpacities, cardTranslateY]);

  const cardAnimStyle = (idx: number) => ({
    opacity: cardOpacities[idx],
    transform: [{ translateY: cardTranslateY[idx] }],
  });

  const cards = [
    { label: t('onboarding_final_screen.card_calories'), color: Green },
    { label: t('onboarding_final_screen.card_protein'), color: Blue },
    { label: t('onboarding_final_screen.card_fat'), color: Purple },
    { label: t('onboarding_final_screen.card_carbs'), color: Orange },
  ];

  return (
    <Root>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View style={{ flex: 1, opacity: screenOpacity }}>
          <Container>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Spacer direction="vertical" size="xxl-2" />

              <TopContainer>
                <StepIndicator current={5} total={5} />
                <Spacer direction="vertical" size="xxl-2" />
                <IconBox>
                  <TrophyIcon width={48} height={48} fill={White} />
                </IconBox>

                <TextContainer>
                  <Title>{t('onboarding_final_screen.title')}</Title>
                  <Spacer direction="vertical" size="m" />

                  <CustomSubtitle>
                    {t('onboarding_final_screen.subtitle')}
                  </CustomSubtitle>
                </TextContainer>
              </TopContainer>

              <DailyTargetContainer>
                {/* Icon + Title fade together */}
                <Animated.View style={{ opacity: headerOpacity }}>
                  <SmallIconBox>
                    <TrophyIcon width={32} height={32} fill={White} />
                  </SmallIconBox>
                </Animated.View>

                <Spacer direction="vertical" size="s" />

                <Animated.View style={{ opacity: headerOpacity }}>
                  <DailyGoalsTitle>
                    {t('onboarding_final_screen.daily_goals_title')}
                  </DailyGoalsTitle>
                </Animated.View>

                <Spacer direction="vertical" size="xl" />

                <Row>
                  <Animated.View style={[{ flex: 1 }, cardAnimStyle(0)]}>
                    <Card>
                      <CardValue color={cards[0].color}>
                        {dailyTargets.calories}
                      </CardValue>
                      <CardLabel>{cards[0].label}</CardLabel>
                    </Card>
                  </Animated.View>

                  <Spacer direction="horizontal" size="m" />

                  <Animated.View style={[{ flex: 1 }, cardAnimStyle(1)]}>
                    <Card>
                      <CardValue color={cards[1].color}>
                        {dailyTargets.proteinGrams}
                      </CardValue>
                      <CardLabel>{cards[1].label}</CardLabel>
                    </Card>
                  </Animated.View>
                </Row>

                <Spacer direction="vertical" size="m" />

                <Row>
                  <Animated.View style={[{ flex: 1 }, cardAnimStyle(2)]}>
                    <Card>
                      <CardValue color={cards[2].color}>
                        {dailyTargets.fatGrams}
                      </CardValue>
                      <CardLabel>{cards[2].label}</CardLabel>
                    </Card>
                  </Animated.View>

                  <Spacer direction="horizontal" size="m" />

                  <Animated.View style={[{ flex: 1 }, cardAnimStyle(3)]}>
                    <Card>
                      <CardValue color={cards[3].color}>
                        {dailyTargets.carbsGrams}
                      </CardValue>
                      <CardLabel>{cards[3].label}</CardLabel>
                    </Card>
                  </Animated.View>
                </Row>

                <Spacer direction="vertical" size="s" />
                <DailyGoalsText>
                  {t('onboarding_final_screen.daily_goals_note')}
                </DailyGoalsText>
              </DailyTargetContainer>

              <Spacer direction="vertical" size="xl" />

              <ButtonsContainer>
                <CustomButton
                  label={t('onboarding_final_screen.btn_lets_go')}
                  backgroundColor={Green}
                  color={White}
                  loading={isLoading}
                  onPress={handleSubmitOnboarding}
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
                          {t('onboarding_final_screen.back')}
                        </BackButtonLabel>
                      </IconRow>
                    </Pressable>
                  </BackButtonContainer>
                </Row>
              </ButtonsContainer>
            </ScrollView>
          </Container>
        </Animated.View>
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

const DailyTargetContainer = styled.View`
  flex: 1;
  margin: 0px 20px;
  padding: 20px;
  background-color: ${LightGreen};
  border-radius: 16px;
  border: 1px solid ${Green};
  align-items: center;
  justify-content: center;
`;

const Card = styled.View`
  flex: 1;
  padding: 20px;
  border-radius: 16px;
  background-color: ${White};
  align-items: center;
  justify-content: center;
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

const SmallIconBox = styled(LinearGradient).attrs({
  colors: ['#34D399', '#8bcdb7'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
})`
  width: 72px;
  height: 72px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
`;

const ButtonsContainer = styled.View`
  flex: 1;
  padding: 0px 20px;
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

const CardValue = styled.Text<{ color: string }>`
  ${HeadingXL};
  color: ${({ color }) => color || Gray4};
  font-weight: bold;
  text-align: right;
`;

const CardLabel = styled.Text`
  ${TextM};
  color: ${Gray1};
`;

const BackButtonLabel = styled.Text`
  ${TextSLight};
  font-weight: bold;
  text-align: right;
`;

const DailyGoalsTitle = styled.Text`
  ${HeadingM};
  font-weight: bold;
`;

const DailyGoalsText = styled.Text`
  ${TextM};
  color: ${Gray1};
  text-align: center;
`;

export default OnboardingFinalScreen;
