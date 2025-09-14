import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Gray1, Gray7, Green, White } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../lib/routes/Router';
import { useTranslation } from 'react-i18next';
import { UnitType } from '../../data/UnitType';
import LinearGradient from 'react-native-linear-gradient';
import Spacer from '../../components/spacer/Spacer';
import StepIndicator from '../../components/step-indicator/StepIndicator';
import {
  Subtitle,
  HeadingL,
  TextSLight,
  TextM,
  HeadingXL,
} from '../../theme/typography';
import ArrowRightIcon from '../../../assets/icons/arrow-right.svg';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import i18n from '../../i18n';
import WeightIcon from '../../../assets/icons/weight.svg';
import SwitchButton from '../../components/buttons/SwitchButton';
import CustomInput from '../../components/input/CustomInput';
import CustomButton from '../../components/buttons/CustomButton';
import FadeInView from '../../components/animations/FadeInView';
import useKeyboardVisible from '../../lib/keyboard/useKeyboardVisible';
import SegmentedSwitch from '../../components/buttons/SegmentedSwitch';

const OnboardingSecondScreen = () => {
  const { t } = useTranslation();
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [unitType, setUnitType] = useState<UnitType>(UnitType.Metric);
  const isKeyboardVisible = useKeyboardVisible();

  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const isRtl = i18n.dir() === 'rtl';
  const ArrowIcon = isRtl ? ArrowRightIcon : ArrowLeftIcon;

  const weightLabel =
    unitType === UnitType.Metric
      ? t('onboarding_second_screen.weight_kg')
      : t('onboarding_second_screen.weight_lbs');

  const heightLabel =
    unitType === UnitType.Metric
      ? t('onboarding_second_screen.height_cm')
      : t('onboarding_second_screen.height_ft');

  const handleNextScreen = () => {
    navigation.navigate('OnboardingThird', {
      unitType: unitType,
      height: unitType === UnitType.Metric ? height : height * 0.0328084,
      weight: unitType === UnitType.Metric ? weight : weight * 2.20462,
    });
  };

  return (
    <Root>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled={isKeyboardVisible}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <Spacer direction="vertical" size="xxl-4" />
        <Container>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Content>
              <TopContainer>
                <StepIndicator current={2} total={5} />
                <Spacer direction="vertical" size="xxl-2" />

                <IconBox>
                  <WeightIcon width={36} height={36} fill={White} />
                </IconBox>

                <TextContainer>
                  <Title>{t('onboarding_second_screen.title')}</Title>
                  <Spacer direction="vertical" size="s" />

                  <FadeInView direction="up" delay={300}>
                    <CustomSubtitle>
                      {t('onboarding_second_screen.subtitle')}
                    </CustomSubtitle>
                  </FadeInView>
                </TextContainer>
              </TopContainer>

              <BottomContainer>
                <SegmentedSwitch
                  value={unitType}
                  options={[
                    {
                      value: UnitType.Metric,
                      label: t('onboarding_second_screen.metric'),
                    },
                    {
                      value: UnitType.Imperial,
                      label: t('onboarding_second_screen.imperial'),
                    },
                  ]}
                  onChange={setUnitType}
                />
                {/* <SwitchButton value={unitType} onChange={setUnitType} /> */}
                <Spacer direction="vertical" size="xl" />

                <InputsContainer>
                  <CustomInput
                    value={
                      unitType === UnitType.Metric
                        ? weight
                        : Math.round(weight * 2.20462 * 10) / 10
                    }
                    label={weightLabel}
                    onChangeText={value => {
                      setWeight(Number(value));
                    }}
                  />
                  <Spacer direction="vertical" size="xl" />

                  <CustomInput
                    value={
                      unitType === UnitType.Metric
                        ? height
                        : Math.round(height * 0.0328084 * 10) / 10
                    }
                    label={heightLabel}
                    onChangeText={value => {
                      setHeight(Number(value));
                    }}
                  />
                </InputsContainer>
              </BottomContainer>
            </Content>

            <Spacer direction="vertical" size="s" />

            <ButtonsContainer>
              <CustomButton
                label={t('onboarding_second_screen.next')}
                onPress={handleNextScreen}
                type="primary"
                backgroundColor={Green}
              />
              <Spacer direction="vertical" size="m" />

              <Row>
                <Pressable
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <BackButtonContainer>
                    <IconRow>
                      <ArrowIcon
                        width={24}
                        height={24}
                        fill={Gray1}
                        stroke={Gray1}
                      />
                      <Spacer direction="horizontal" size="s" />

                      <BackButtonLabel>
                        {t('onboarding_second_screen.back')}
                      </BackButtonLabel>
                    </IconRow>
                  </BackButtonContainer>
                </Pressable>

                <SkipButtonContainer>
                  <Pressable onPress={() => null}>
                    <SkipButtonLabel>
                      {t('onboarding_second_screen.skip_for_now')}
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
  padding: 0px 20px;
`;

const Container = styled.View`
  flex: 1;
`;

const Content = styled.View`
  flex: 1;
`;

const TopContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const BottomContainer = styled.View``;

const TextContainer = styled.View`
  padding: 20px;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const InputsContainer = styled.View`
  width: 100%;

  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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

const ButtonsContainer = styled.View`
  padding: 20px 0px;
  width: 100%;
`;

const NextButtonContainer = styled(LinearGradient).attrs({
  colors: ['#34D399', '#10B981'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
})`
  width: 100%;
  border-radius: 16px;
  align-items: center;
  padding: 20px;
  shadow-color: ${Gray1};
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  shadow-offset: 0px 8px;
  elevation: 3;
`;

const NextButtonLabel = styled.Text`
  ${TextM};
  color: ${White};
  font-weight: bold;
  text-align: right;
`;

export default OnboardingSecondScreen;
