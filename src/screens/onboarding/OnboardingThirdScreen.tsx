import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import {
  Dark,
  Gray1,
  Gray4,
  Gray7,
  Green,
  LightGreen,
  White,
} from '../../theme/colors';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../lib/routes/Router';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import Spacer from '../../components/spacer/Spacer';
import StepIndicator from '../../components/step-indicator/StepIndicator';
import {
  Subtitle,
  TextSLight,
  TextM,
  HeadingXL,
  TextS,
} from '../../theme/typography';
import ArrowRightIcon from '../../../assets/icons/arrow-right.svg';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import i18n from '../../i18n';
import CalendarIcon from '../../../assets/icons/calendar.svg';
import { Gender } from '../../data/IUser';
import CustomButton from '../../components/buttons/CustomButton';
import { format } from 'date-fns';

import MaleIcon from '../../../assets/icons/gender-male.svg';
import FemaleIcon from '../../../assets/icons/gender-female.svg';
import OtherIcon from '../../../assets/icons/gender-other.svg';
import DateTimePicker from '@react-native-community/datetimepicker';

const OnboardingThirdScreen = () => {
  const { t } = useTranslation();
  const [gender, setGender] = useState<Gender>(Gender.Female);
  const [dateBirth, setDateBirth] = useState<string | number | Date>(
    new Date(),
  );

  const [openDatePicker, setOpenDatePicker] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const route =
    useRoute<RouteProp<OnboardingStackParamList, 'OnboardingThird'>>();

  const { unitType, height, weight } = route.params;

  const isRtl = i18n.dir() === 'rtl';
  const ArrowIcon = isRtl ? ArrowRightIcon : ArrowLeftIcon;

  const handleNextScreen = () => {
    navigation.navigate('OnboardingForth', {
      unitType: unitType,
      height: height,
      weight: weight,
      gender: gender,
      dateBirth: dateBirth,
    });
  };

  return (
    <Root>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                <StepIndicator current={3} total={5} />
                <Spacer direction="vertical" size="xxl-2" />
                <IconBox>
                  <CalendarIcon width={48} height={48} fill={White} />
                </IconBox>

                <TextContainer>
                  <Title>{t('onboarding_third_screen.title')}</Title>
                  <Spacer direction="vertical" size="s" />

                  <CustonSubtitle>
                    {t('onboarding_third_screen.subtitle')}
                  </CustonSubtitle>
                </TextContainer>
              </TopContainer>

              <BottomContainer>
                <DateSelectionContainer>
                  <Label>{t('onboarding_third_screen.birth_date')}</Label>

                  <Spacer direction="vertical" size="xs" />
                  {openDatePicker && (
                    <DateTimePicker
                      mode="date"
                      display="spinner"
                      value={new Date(dateBirth)}
                      onChange={(event, date) => {
                        if (date) {
                          setDateBirth(date);
                        }
                        setOpenDatePicker(false);
                      }}
                    />
                  )}
                  <Pressable
                    onPress={() => {
                      setOpenDatePicker(true);
                    }}
                  >
                    <DateInputContainer>
                      <IconRow>
                        <CalendarIcon
                          width={22}
                          height={22}
                          fill={Gray1}
                          stroke={Gray1}
                        />
                        <Spacer direction="horizontal" size="xs" />
                        <DateInputValue>
                          {format(
                            dateBirth,
                            isRtl ? 'dd/MM/yyyy' : 'MM/dd/yyyy',
                          )}
                        </DateInputValue>
                      </IconRow>
                    </DateInputContainer>
                  </Pressable>
                </DateSelectionContainer>
                <Spacer direction="vertical" size="xl" />

                <GenderSelectionContainer>
                  <Label>{t('onboarding_third_screen.gender')}</Label>
                  <Spacer direction="vertical" size="xs" />
                  <Row>
                    <GenderSelectionBox
                      isActive={gender === Gender.Female}
                      onPress={() => {
                        setGender(Gender.Female);
                      }}
                    >
                      <FemaleIcon width={32} height={32} fill={Gray1} />
                      <Spacer direction="vertical" size="xxs" />
                      <GenderLabel>
                        {t('onboarding_third_screen.gender_female')}
                      </GenderLabel>
                    </GenderSelectionBox>
                    <Spacer direction="horizontal" size="s" />
                    <GenderSelectionBox
                      isActive={gender === Gender.Male}
                      onPress={() => {
                        setGender(Gender.Male);
                      }}
                    >
                      <MaleIcon width={32} height={32} fill={Gray1} />
                      <Spacer direction="vertical" size="xxs" />
                      <GenderLabel>
                        {t('onboarding_third_screen.gender_male')}
                      </GenderLabel>
                    </GenderSelectionBox>
                    <Spacer direction="horizontal" size="s" />

                    <GenderSelectionBox
                      isActive={gender === Gender.Other}
                      onPress={() => {
                        setGender(Gender.Other);
                      }}
                    >
                      <OtherIcon width={32} height={32} fill={Gray1} />
                      <Spacer direction="vertical" size="xxs" />
                      <GenderLabel>
                        {t('onboarding_third_screen.gender_other')}
                      </GenderLabel>
                    </GenderSelectionBox>
                  </Row>
                </GenderSelectionContainer>
              </BottomContainer>

              <ButtonsContainer>
                <CustomButton
                  label={t('onboarding_third_screen.next')}
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
                          {t('onboarding_third_screen.back')}
                        </BackButtonLabel>
                      </IconRow>
                    </Pressable>
                  </BackButtonContainer>
                  <SkipButtonContainer>
                    <Pressable onPress={() => null}>
                      <SkipButtonLabel>
                        {t('onboarding_third_screen.skip_for_now')}
                      </SkipButtonLabel>
                    </Pressable>
                  </SkipButtonContainer>
                </Row>
              </ButtonsContainer>
            </Content>
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

const BottomContainer = styled.View`
  flex: 1;
  padding: 20px;
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

const CustonSubtitle = styled(Subtitle)`
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
  padding: 20px;
  width: 100%;
`;

const DateSelectionContainer = styled.View``;

const GenderSelectionContainer = styled.View`
  flex: 1;
`;

const GenderSelectionBox = styled.Pressable<{ isActive?: boolean }>`
  flex: 1;
  height: 100px;
  padding: 8px;
  border-radius: 16px;
  background: ${({ isActive }) => (isActive ? LightGreen : White)};
  ${({ isActive }) =>
    isActive ? `border: 2px solid ${Green}` : `border: 1px solid ${Gray4}`};
  align-items: center;
  justify-content: center;
  shadow-color: ${Gray1};
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  shadow-offset: 0px 8px;
  elevation: 3;
`;
const GenderLabel = styled.Text`
  ${TextM}
`;

const DateInputContainer = styled.View`
  padding: 16px;
  background: ${White};
  border-radius: 16px;
  border: 1px solid ${Gray4};
`;

const Label = styled.Text`
  ${TextM};
`;

const DateInputValue = styled.Text`
  ${TextS};
  color: ${Gray1};
`;

export default OnboardingThirdScreen;
