import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  Animated,
  Easing,
  Platform,
  Pressable,
} from 'react-native';

import {
  Blue,
  Dark,
  Gray1,
  Gray4,
  Gray7,
  Green,
  Light,
  LightGreen,
  Red,
  White,
} from '../../theme/colors';
import styled from '../../../styled-components';
import { HeadingM, TextL, TextM, TextS } from '../../theme/typography';
import Spacer from '../../components/spacer/Spacer';
import AccountIcon from '../../../assets/icons/nav-bar/navigation-account.svg';
import LinearGradient from 'react-native-linear-gradient';
import SettingsIcon from '../../../assets/icons/settings-copy.svg';
import TargetIcon from '../../../assets/icons/target.svg';
import PulseIcon from '../../../assets/icons/pulse.svg';
import CustomInput from '../../components/input/CustomInput';
import { Dropdown } from 'react-native-element-dropdown';
import { Option } from '../../components/dropdown/Dropdown';

import { useTranslation } from 'react-i18next';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootTabParamList } from '../../lib/routes/tab-navigator/TabNavigator';
import useAuth from '../../lib/auth/useAuth';
import CustomButton from '../../components/buttons/CustomButton';
import useUserData from '../../lib/user-data/useUserData';
import { ActivityLevel } from '../../data/ActivityLevel';
import { UserGoal } from '../../data/UserGoal';
import { useToast } from 'react-native-toast-notifications';
import {
  ACTIVITY_LEVEL_FROM_STRING,
  ACTIVITY_LEVEL_TO_STRING,
  USER_GOAL_FROM_STRING,
  USER_GOAL_TO_STRING,
} from '../../utils/mappers/userGoalsMapper';
import CustomTopBar from '../../components/custom-top-bar/CustomTopBar';
import { UnitType } from '../../data/UnitType';

const ProfileScreen = () => {
  const { user } = useAuth();
  const { userGoals, userSettings, updateUserGoals } = useUserData();
  const { t } = useTranslation();
  const toast = useToast();

  const isFocused = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootTabParamList>>();

  const [height, setHeight] = useState(
    userGoals ? userGoals.height.toString() : '',
  );
  const [weight, setWeight] = useState(
    userGoals ? userGoals.weight.toString() : '',
  );

  const [weightGoal, setWeightGoal] = useState<UserGoal>(
    userGoals?.weightGoal || UserGoal.MaintainWeight,
  );
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    userGoals?.activityLevel || ActivityLevel.Sedentary,
  );
  const [preferredUnits, setPreferredUnits] = useState<UnitType>(
    userSettings?.preferredUnits || UnitType.Metric,
  );

  // one animation for all cards
  const fade = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(12)).current;
  const [showShadow, setShowShadow] = useState(false);
  const [dailyNutrionGoals, setDailyNutritionGoals] = useState({
    dailyCalories: userGoals?.dailyCalories || 0,
    dailyProtein: userGoals?.dailyProtein || 0,
    dailyFat: userGoals?.dailyFat || 0,
    dailyCarbs: userGoals?.dailyCarbs || 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const reset = () => {
      fade.setValue(0);
      ty.setValue(12);
      setShowShadow(false);
    };

    if (!isFocused) {
      reset();
      return;
    }

    reset();
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(ty, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => setShowShadow(true));
  }, [isFocused, fade, ty]);

  const weightGoalData: Option[] = [
    {
      label: t('profile_screen.weight_goal_options.lose_weight'),
      value: 'lose',
    },
    {
      label: t('profile_screen.weight_goal_options.maintain_weight'),
      value: 'maintain',
    },
    {
      label: t('profile_screen.weight_goal_options.gain_weight'),
      value: 'gain',
    },
  ];

  const activityLevelData: Option[] = [
    {
      label: t('profile_screen.activity_level_options.sedentary'),
      value: 'sedentary',
    },
    {
      label: t('profile_screen.activity_level_options.lightly_active'),
      value: 'light',
    },
    {
      label: t('profile_screen.activity_level_options.moderately_active'),
      value: 'moderate',
    },
    {
      label: t('profile_screen.activity_level_options.very_active'),
      value: 'active',
    },
    {
      label: t('profile_screen.activity_level_options.extra_active'),
      value: 'extra',
    },
  ];

  const preferredUnitsData: Option[] = [
    {
      label: t('profile_screen.preferred_units_options.metric'),
      value: UnitType.Metric,
    },
    {
      label: t('profile_screen.preferred_units_options.imperial'),
      value: UnitType.Imperial,
    },
  ];

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      const updatedUserGoals = {
        dailyCalories: dailyNutrionGoals.dailyCalories,
        dailyProtein: dailyNutrionGoals.dailyProtein,
        dailyFat: dailyNutrionGoals.dailyFat,
        dailyCarbs: dailyNutrionGoals.dailyCarbs,
        weightGoal,
        activityLevel,
        preferredUnits,
        height: Number(height),
        weight: Number(weight),
      };

      await updateUserGoals(updatedUserGoals);

      toast.show(t('toast.profile_updated'), {
        type: 'success',
        placement: 'bottom',
        textStyle: { color: Green },
      });

      setIsLoading(false);

      // Optionally, you can show a success message or navigate back
    } catch (err) {
      console.error('Error saving changes:', err);
      setIsLoading(false);
      toast.show(t('toast.error'), {
        type: 'danger',
        placement: 'bottom',
        textStyle: { color: Red },
      });
    }
  };

  return (
    <Root>
      <CustomTopBar />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Container>
          <AccountIcon width={40} height={40} fill={Green} />
          <Spacer direction="vertical" size="xs" />
          <Title>{t('profile_screen.title')}</Title>
          <Subitle>{t('profile_screen.subtitle')}</Subitle>

          <Spacer direction="vertical" size="xxl-2" />

          <TopCard
            style={{
              opacity: fade,
              transform: [{ translateY: ty }],
              shadowOpacity: showShadow ? 0.1 : 0,
              ...(Platform.OS === 'android'
                ? { elevation: showShadow ? 3 : 0 }
                : null),
            }}
          >
            <Row>
              <IconBox>
                <AccountIcon width={28} height={28} fill={White} />
              </IconBox>
              <Spacer direction="horizontal" size="m" />
              <TextContainer>
                <MainLabel>{user!.fullName || 'John Doe'}</MainLabel>
                <SubLabel>{user!.email || 'johndoe@gmail.com'}</SubLabel>
              </TextContainer>
              <GenericIconBox>
                <Pressable
                  onPress={() => {
                    navigation.navigate('Settings');
                  }}
                >
                  <SettingsIcon width={24} height={24} fill={Dark} />
                </Pressable>
              </GenericIconBox>
            </Row>
          </TopCard>

          <Spacer direction="vertical" size="m" />

          <MainCard
            style={{
              opacity: fade,
              transform: [{ translateY: ty }],
              shadowOpacity: showShadow ? 0.1 : 0,
              ...(Platform.OS === 'android'
                ? { elevation: showShadow ? 3 : 0 }
                : null),
            }}
          >
            <CardTitleContainer>
              <TitleIconContainer backgroundColor={LightGreen}>
                <TargetIcon width={24} height={24} fill={Green} />
              </TitleIconContainer>
              <Spacer direction="horizontal" size="s" />
              <CardTitle>{t('profile_screen.daily_goals')}</CardTitle>
            </CardTitleContainer>

            <Spacer direction="vertical" size="xl" />
            <CardRow>
              <CustomInput
                label={t('profile_screen.daily_calories')}
                value={dailyNutrionGoals.dailyCalories.toString()}
                onChangeText={value => {
                  setDailyNutritionGoals(prev => ({
                    ...prev,
                    dailyCalories: Number(value),
                  }));
                }}
              />
              <Spacer direction="horizontal" size="s" />
              <CustomInput
                label={t('profile_screen.daily_protein')}
                value={dailyNutrionGoals.dailyProtein.toString()}
                onChangeText={value => {
                  setDailyNutritionGoals(prev => ({
                    ...prev,
                    dailyProtein: Number(value),
                  }));
                }}
              />
            </CardRow>

            <Spacer direction="vertical" size="xl" />
            <CardRow>
              <CustomInput
                label={t('profile_screen.daily_fat')}
                value={dailyNutrionGoals.dailyFat.toString()}
                onChangeText={value => {
                  setDailyNutritionGoals(prev => ({
                    ...prev,
                    dailyFat: Number(value),
                  }));
                }}
              />
              <Spacer direction="horizontal" size="s" />
              <CustomInput
                label={t('profile_screen.daily_carbs')}
                value={dailyNutrionGoals.dailyCarbs.toString()}
                onChangeText={value => {
                  setDailyNutritionGoals(prev => ({
                    ...prev,
                    dailyCarbs: Number(value),
                  }));
                }}
              />
            </CardRow>
          </MainCard>

          <Spacer direction="vertical" size="xl" />

          {/* Activity & preferences */}
          <MainCard
            style={{
              opacity: fade,
              transform: [{ translateY: ty }],
              shadowOpacity: showShadow ? 0.1 : 0,
              ...(Platform.OS === 'android'
                ? { elevation: showShadow ? 3 : 0 }
                : null),
            }}
          >
            <CardTitleContainer>
              <TitleIconContainer backgroundColor={Light}>
                <PulseIcon width={24} height={24} fill={Blue} stroke={Blue} />
              </TitleIconContainer>
              <Spacer direction="horizontal" size="s" />
              <CardTitle>{t('profile_screen.activity_prefs')}</CardTitle>
            </CardTitleContainer>
            <Spacer direction="vertical" size="xl" />

            <Row>
              <CustomInput
                value={height}
                onChangeText={setHeight}
                label={
                  preferredUnits === UnitType.Metric
                    ? t('profile_screen.height_metric')
                    : t('profile_screen.height_imperial')
                }
              />
              <Spacer direction="horizontal" size="s" />
              <CustomInput
                value={weight}
                onChangeText={setWeight}
                label={
                  preferredUnits === UnitType.Metric
                    ? t('profile_screen.weight_metric')
                    : t('profile_screen.weight_imperial')
                }
              />
            </Row>

            <Spacer direction="vertical" size="xl" />
            <DropdownContainer>
              <DropdownLabel>{t('profile_screen.weight_goal')}</DropdownLabel>
              <Spacer direction="vertical" size="xs" />
              <Dropdown
                data={weightGoalData}
                labelField="label"
                valueField="value"
                placeholder="Select an item"
                value={USER_GOAL_TO_STRING[weightGoal]} // 👈 ממפים enum→string
                selectedTextStyle={{ fontSize: 14 }}
                containerStyle={{ borderRadius: 8, top: 10 }}
                placeholderStyle={{ fontSize: 14 }}
                itemTextStyle={{ fontSize: 14 }}
                onChange={item =>
                  setWeightGoal(USER_GOAL_FROM_STRING[item.value])
                } //  👈 string→enum
                style={{
                  padding: 12,
                  borderRadius: 8,
                  borderColor: Gray4,
                  borderWidth: 1,
                }}
              />
            </DropdownContainer>

            <Spacer direction="vertical" size="xl" />
            <DropdownContainer>
              <DropdownLabel>
                {t('profile_screen.activity_level')}
              </DropdownLabel>
              <Spacer direction="vertical" size="xs" />
              <Dropdown
                data={activityLevelData}
                labelField="label"
                valueField="value"
                placeholder="Select an item"
                value={ACTIVITY_LEVEL_TO_STRING[activityLevel]} // 👈 enum→string
                selectedTextStyle={{ fontSize: 14 }}
                containerStyle={{ borderRadius: 8, top: 10 }}
                placeholderStyle={{ fontSize: 14 }}
                itemTextStyle={{ fontSize: 14 }}
                onChange={item =>
                  setActivityLevel(ACTIVITY_LEVEL_FROM_STRING[item.value])
                } // 👈 string→enum
                style={{
                  padding: 12,
                  borderRadius: 8,
                  borderColor: Gray4,
                  borderWidth: 1,
                }}
              />
            </DropdownContainer>

            <Spacer direction="vertical" size="xl" />
            <DropdownContainer>
              <DropdownLabel>
                {t('profile_screen.preferred_units')}
              </DropdownLabel>
              <Spacer direction="vertical" size="xs" />
              <Dropdown
                data={preferredUnitsData}
                labelField="label"
                valueField="value"
                placeholder="Select an item"
                value={preferredUnits}
                selectedTextStyle={{ fontSize: 14 }}
                containerStyle={{ borderRadius: 8, top: 10 }}
                placeholderStyle={{ fontSize: 14 }}
                itemTextStyle={{ fontSize: 14 }}
                onChange={item => setPreferredUnits(item.value)}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  borderColor: Gray4,
                  borderWidth: 1,
                }}
              />
            </DropdownContainer>

            {/* <Spacer direction="vertical" size="xl" />
            <DropdownContainer>
              <DropdownLabel>{t('profile_screen.language')}</DropdownLabel>
              <Spacer direction="vertical" size="xs" />
              <Dropdown
                data={languageData}
                labelField="label"
                valueField="value"
                placeholder="Select an item"
                value={selectedLanguage}
                selectedTextStyle={{ fontSize: 12 }}
                containerStyle={{ borderRadius: 8, top: 10 }}
                placeholderStyle={{ fontSize: 12 }}
                itemTextStyle={{ fontSize: 12 }}
                onChange={async item => {
                  setSelectedLanguage(item.value);
                  await i18n.changeLanguage(item.value);
                }}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  borderColor: Gray4,
                  borderWidth: 1,
                }}
              />
            </DropdownContainer> */}
          </MainCard>

          <Spacer direction="vertical" size="xl" />

          <CustomButton
            label={t('profile_screen.save_changes')}
            loading={isLoading}
            onPress={handleSaveChanges}
          />

          <Spacer direction="vertical" size="xl" />
        </Container>
      </ScrollView>
    </Root>
  );
};

const Root = styled.View`
  flex: 1;
  background-color: ${Gray7};
`;

const Container = styled.View`
  align-items: center;
  padding: 20px;
  justify-content: center;
`;

const Title = styled.Text`
  ${HeadingM};
  font-weight: bold;
`;

const Subitle = styled.Text`
  ${TextS};
  color: ${Gray1};
`;

const TopCard = styled(Animated.View)`
  width: 100%;
  height: 120px;
  background-color: ${White};
  padding: 20px;
  border-radius: 16px;
  justify-content: center;

  shadow-color: ${Gray1};
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  shadow-offset: 0px 8px;
  elevation: 3;
`;

const MainCard = styled(Animated.View)`
  width: 100%;
  background-color: ${White};
  padding: 20px;
  border-radius: 8px;

  shadow-color: ${Gray1};
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  shadow-offset: 0px 8px;
  elevation: 3;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const GenericIconBox = styled.View`
  padding: 4px;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 32px;
  background: ${Gray4};
`;

const IconBox = styled(LinearGradient).attrs({
  colors: ['#34D399', '#10B981'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
})`
  padding: 12px;
  height: 72px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
`;

const TextContainer = styled.View`
  flex: 1;
`;

const MainLabel = styled.Text`
  ${TextM};
  font-weight: bold;
`;
const SubLabel = styled.Text`
  ${TextS};
  color: ${Gray1};
`;

const CardTitle = styled.Text`
  ${TextL};
  font-weight: bold;
`;

const CardTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const CardRow = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const ButtonContainer = styled(LinearGradient).attrs({
  colors: ['#34D399', '#10B981'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
})`
  width: 100%;
  border-radius: 16px;
  shadow-color: ${Gray1};
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  shadow-offset: 0px 8px;
  elevation: 3;
`;

const TitleIconContainer = styled.View<{ backgroundColor: string }>`
  border-color: ${({ backgroundColor }) => backgroundColor};
  padding: 12px;
  border-radius: 16px;
`;

const DropdownContainer = styled.View`
  width: 100%;
`;

const DropdownLabel = styled.Text`
  ${TextM};
`;

export default ProfileScreen;
