import { View, Text, Pressable, ScrollView } from 'react-native';
import React, { useCallback, useState } from 'react';
import styled from '../../../styled-components';
import {
  Blue,
  Dark,
  Gray1,
  Gray4,
  Gray7,
  Green,
  LightBlue,
  LightGreen,
  LightOrange,
  LightPurple,
  LightRed,
  Orange,
  Purple,
  Red,
  White,
} from '../../theme/colors';
import {
  HeadingM,
  TextL,
  TextM,
  TextS,
  TextSLight,
} from '../../theme/typography';
import Spacer from '../../components/spacer/Spacer';
import ChevronRightIcon from '../../../assets/icons/chevron-right.svg';
import ChevronLeftIcon from '../../../assets/icons/chevron-left.svg';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootTabParamList } from '../../lib/routes/tab-navigator/TabNavigator';
import GlobeIcon from '../../../assets/icons/global.svg';
import PaletteIcon from '../../../assets/icons/palette-icon.svg';
import NotificationIcon from '../../../assets/icons/notifications.svg';
import ShieldIcon from '../../../assets/icons/shield.svg';
import WarningIcon from '../../../assets/icons/warning.svg';
import { flagFor, languageData, themeData, themeIcon } from './utils';
import { Dropdown } from 'react-native-element-dropdown';
import useAuth from '../../lib/auth/useAuth';
import CustomInput from '../../components/input/CustomInput';
import CustomButton from '../../components/buttons/CustomButton';
import { useToast } from 'react-native-toast-notifications';
import CustomSwitchButton from '../../components/buttons/CustomSwitchButton';
import LogoutModal from '../../components/logout/LogoutModal';
import CalendarIcon from '../../../assets/icons/calendar.svg';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import CalendarPicker from '../../components/calendar-picker/CalendarPicker.native';
import Modal from '../../components/modal/Modal';
import { ProfileStackParams } from '../../lib/routes/profile/ProfileStack';
import { RootStackParamList } from '../../lib/routes/Router';

const SettingsScreen = () => {
  const { user, updateUser, signOut } = useAuth();
  const toast = useToast();
  // const {userSettings} = useUserSettings()
  const { t } = useTranslation();
  const [fullName, setFullName] = useState<string>(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(
    user?.phoneNumber || '',
  );
  const [email, setEmail] = useState<string>(user?.email || '');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    user?.language || 'en',
  );
  const [selectedTheme, setSelectedTheme] = useState<string>('light');
  const [isEnabledNotifications, setIsEnabledNotifications] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShareData, setIsShareData] = useState<boolean>(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState<boolean>(false);
  const [dateBirth, setDateBirth] = useState<string | number | Date>(
    user?.dateBirth || new Date(),
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [isSelectingDate, setIsSelectingDate] = useState(false); // New flag to track selection in progress

  const [openDatePicker, setOpenDatePicker] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isRtl = i18n.dir() === 'rtl';
  const ChevronBackIcon = isRtl ? ChevronRightIcon : ChevronLeftIcon;
  const ChevronIcon = isRtl ? ChevronLeftIcon : ChevronRightIcon;

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      await updateUser({
        ...user!,
        fullName: fullName,
        email: email,
        language: selectedLanguage,
        dateBirth: new Date(dateBirth),
        phoneNumber: phoneNumber,
      });
      if (i18n.language !== selectedLanguage) {
        await i18n.changeLanguage(selectedLanguage);
      }
      setIsLoading(false);
      toast.show(t('toast.settings_saved'), {
        type: 'success',
        placement: 'bottom',
        textStyle: { color: Green },
      });
    } catch (err) {
      console.log('Error update user - Settings screen: ', err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.show(t('toast.success_logout'), {
        type: 'success',
        placement: 'bottom',
        textStyle: { color: Green },
      });
    } catch (err) {
      console.log('Error logout user - Settings screen: ', err);
    }
  };

  // const handleDateSelection = useCallback(
  //   (date?: Date) => {
  //     console.log('SS');
  //     if (!date || isSelectingDate) return; // Prevent repeated calls
  //     setIsSelectingDate(true); // Set flag to prevent loop
  //     console.log('Date selected:', date); // For debugging
  //     setDateBirth(date);
  //     setOpenDatePicker(false);
  //     // setIsCalendarOpen(false); // Close modal after date selection
  //     // onSelectedDateChanged(date);
  //     setTimeout(() => setIsSelectingDate(false), 300);
  //   },
  //   [isSelectingDate],
  // );

  const handleDateChange = (date: Date) => {
    console.log('Date selected:', format(date, 'dd-MM-yyyy')); // For debugging
    setDateBirth(date);
    setOpenDatePicker(false);
    setIsSelectingDate(false);
  };

  return (
    <Root>
      <Modal
        visible={openDatePicker}
        onRequestClose={() => setOpenDatePicker(false)}
      >
        <CalendarPicker
          date={dateBirth ? new Date(dateBirth) : new Date()}
          color={Orange}
          onChange={value => {
            handleDateChange(value);
          }}
        />
      </Modal>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Container>
          <Spacer direction="vertical" size="xxs" />

          <TitleContainer>
            <Row>
              <Pressable onPress={() => navigation.goBack()}>
                <ChevronBackIcon width={24} height={24} fill={Dark} />
              </Pressable>

              <Spacer direction="horizontal" size="xxl" />
              <View>
                <Title>{t('settings_screen.title')}</Title>
                <Subtitle>{t('settings_screen.subtitle')}</Subtitle>
              </View>
            </Row>
          </TitleContainer>
          <Spacer direction="vertical" size="xxl" />

          <Card>
            <CardTitleRow>
              <TitleIconContainer backgroundColor={LightGreen}>
                <GlobeIcon width={24} height={24} fill={Green} />
              </TitleIconContainer>
              <Spacer direction="horizontal" size="s" />
              <CardTitle>{t('settings_screen.personal_info')}</CardTitle>
            </CardTitleRow>
            <Spacer direction="vertical" size="m" />

            <Row>
              <CustomInput
                label={t('settings_screen.full_name')}
                placeholder={user ? user.fullName : ''}
                value={fullName}
                onChangeText={setFullName}
              />
              <Spacer direction="horizontal" size="m" />

              <DateSelectionContainer>
                <Label>{t('onboarding_third_screen.birth_date')}</Label>

                <Spacer direction="vertical" size="xs" />
                {false && (
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
                    // isSelectingDate(true);
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
                        {format(dateBirth, isRtl ? 'dd/MM/yyyy' : 'MM/dd/yyyy')}
                      </DateInputValue>
                    </IconRow>
                  </DateInputContainer>
                </Pressable>
              </DateSelectionContainer>
            </Row>
            <Spacer direction="vertical" size="m" />

            <CustomInput
              label={t('settings_screen.email')}
              placeholder={user ? user.email : ''}
              value={email}
              onChangeText={setEmail}
            />
          </Card>
          <Spacer direction="vertical" size="xxl" />

          <Card>
            <CardTitleRow>
              <TitleIconContainer backgroundColor={LightBlue}>
                <GlobeIcon width={24} height={24} fill={Blue} />
              </TitleIconContainer>
              <Spacer direction="horizontal" size="s" />
              <CardTitle>{t('settings_screen.language')}</CardTitle>
            </CardTitleRow>
            <Spacer direction="vertical" size="m" />

            <DropdownContainer>
              <Dropdown
                data={languageData}
                labelField="label"
                valueField="value"
                value={selectedLanguage}
                placeholder="Select an item"
                onChange={async item => {
                  setSelectedLanguage(item.value);
                }}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  borderColor: Gray4,
                  borderWidth: 1,
                }}
                containerStyle={{
                  borderRadius: 12,
                  top: 10,
                  elevation: 12,
                }}
                selectedTextStyle={{ fontSize: 14 }}
                placeholderStyle={{ fontSize: 14 }}
                itemTextStyle={{ fontSize: 14 }}
                dropdownPosition="auto"
                renderItem={item => (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 12,
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>{item.flag}</Text>
                    <Spacer direction="horizontal" size="s" />
                    <Text style={{ fontSize: 12 }}>{item.label}</Text>
                  </View>
                )}
                renderLeftIcon={() => (
                  <Text style={{ fontSize: 12, marginRight: 12 }}>
                    {flagFor(selectedLanguage)}
                  </Text>
                )}
              />
            </DropdownContainer>
          </Card>
          <Spacer direction="vertical" size="xxl" />
          <Card>
            <CardTitleRow>
              <TitleIconContainer backgroundColor={LightPurple}>
                <PaletteIcon width={24} height={24} fill={Purple} />
              </TitleIconContainer>
              <Spacer direction="horizontal" size="s" />
              <CardTitle>{t('settings_screen.theme')}</CardTitle>
            </CardTitleRow>
            <Spacer direction="vertical" size="m" />

            <DropdownContainer>
              <Dropdown
                data={themeData}
                labelField="value"
                valueField="value"
                value={selectedTheme}
                placeholder="Select an item"
                onChange={item => {
                  setSelectedTheme(item.value);
                }}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  borderColor: Gray4,
                  borderWidth: 1,
                }}
                containerStyle={{
                  borderRadius: 12,
                  top: 10,
                  elevation: 12,
                }}
                selectedTextStyle={{ fontSize: 14 }}
                placeholderStyle={{ fontSize: 14 }}
                itemTextStyle={{ fontSize: 14 }}
                dropdownPosition="auto"
                renderItem={item => (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 12,
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>{item.icon}</Text>
                    <Spacer direction="horizontal" size="s" />
                    <Text style={{ fontSize: 12 }}>{item.label}</Text>
                  </View>
                )}
                renderLeftIcon={() => (
                  <Text style={{ fontSize: 12, marginRight: 12 }}>
                    {themeIcon(selectedTheme)}
                  </Text>
                )}
              />
            </DropdownContainer>
          </Card>
          <Spacer direction="vertical" size="xxl" />
          <Card>
            <CardTitleRow>
              <TitleIconContainer backgroundColor={LightOrange}>
                <NotificationIcon width={24} height={24} stroke={Orange} />
              </TitleIconContainer>
              <Spacer direction="horizontal" size="s" />
              <CardTitle>{t('settings_screen.notifications')}</CardTitle>
            </CardTitleRow>

            <Spacer direction="vertical" size="m" />

            <CardRow>
              <CardText>{t('settings_screen.notifications_text')}</CardText>
              <CustomSwitchButton
                value={isEnabledNotifications}
                onChange={() =>
                  setIsEnabledNotifications(!isEnabledNotifications)
                }
              />
            </CardRow>
            <Spacer direction="vertical" size="m" />

            <CardSubtext>
              {t('settings_screen.notifications_subtext')}
            </CardSubtext>
          </Card>
          <Spacer direction="vertical" size="xxl" />
          <Card>
            <CardTitleRow>
              <TitleIconContainer backgroundColor={LightRed}>
                <ShieldIcon width={24} height={24} stroke={Red} />
              </TitleIconContainer>
              <Spacer direction="horizontal" size="s" />
              <CardTitle>{t('settings_screen.privacy')}</CardTitle>
            </CardTitleRow>
            <Spacer direction="vertical" size="m" />

            <CardRow>
              <CardText>{t('settings_screen.privacy_text')}</CardText>
              <CustomSwitchButton
                value={isShareData}
                onChange={() => setIsShareData(!isShareData)}
              />
            </CardRow>
            <Spacer direction="vertical" size="m" />

            <CardSubtext>{t('settings_screen.privacy_subtext')}</CardSubtext>

            <Spacer direction="vertical" size="m" />

            <Pressable
              onPress={() => {
                navigation.navigate('Profile', { screen: 'PrivacyPolicy' });
              }}
            >
              <ButtonRow>
                <Label>Privacy policy</Label>
                <ChevronIcon width={24} height={24} fill={Dark} />
              </ButtonRow>
            </Pressable>
            <Spacer direction="vertical" size="m" />

            <Pressable
              onPress={() => {
                navigation.navigate('Terms');
              }}
            >
              <ButtonRow>
                <Label>Terms & Conditions</Label>
                <ChevronIcon width={24} height={24} fill={Dark} />
              </ButtonRow>
            </Pressable>
          </Card>

          <Spacer direction="vertical" size="xxl" />
          <Card>
            <CardTitleRow>
              <TitleIconContainer backgroundColor={Gray4}>
                <WarningIcon width={24} height={24} stroke={Dark} />
              </TitleIconContainer>
              <Spacer direction="horizontal" size="s" />
              <CardTitle>{t('settings_screen.about')}</CardTitle>
            </CardTitleRow>
            <Spacer direction="vertical" size="m" />

            <AboutText>{t('settings_screen.about_text_one')}</AboutText>
            <Spacer direction="vertical" size="xs" />

            <AboutText>{t('settings_screen.about_text_two')}</AboutText>
            <Spacer direction="vertical" size="xs" />

            <AboutText>{t('settings_screen.about_text_three')}</AboutText>
          </Card>

          <ButtonsContainer>
            <CustomButton
              label={t('settings_screen.save_changes')}
              loading={isLoading}
              onPress={handleUpdate}
            />
            <Spacer direction="vertical" size="m" />

            <CustomButton
              label={t('settings_screen.logout')}
              onPress={() => {
                setIsLogoutOpen(true);
              }}
              backgroundColor={LightRed}
              color={Red}
            />
          </ButtonsContainer>
        </Container>
      </ScrollView>

      <LogoutModal
        isOpen={isLogoutOpen}
        onConfirm={handleLogout}
        onClose={() => {
          setIsLogoutOpen(false);
        }}
      />
    </Root>
  );
};

const Root = styled.View`
  flex: 1;
  background: ${Gray7};
`;

const Container = styled.View`
  padding: 20px;
`;

const ButtonsContainer = styled.View`
  padding: 20px 0px;
`;

const TitleContainer = styled.View`
  width: 100%;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.Text`
  ${HeadingM};
  font-weight: bold;
  line-height: 24px;
`;

const Subtitle = styled.Text`
  ${TextM};
  font-size: 14px;
  color: ${Gray1};
`;

const Card = styled.View`
  padding: 20px;
  border-radius: 16px;
  background-color: ${White};
  overflow: visible;
`;

const CardTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const CardRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const CardTitle = styled.Text`
  ${TextL};
  font-weight: bold;
  color: ${Dark};
`;

const CardText = styled.Text`
  ${TextS};
  font-weight: bold;

  color: ${Dark};
`;

const CardSubtext = styled.Text`
  ${TextSLight};
`;

const AboutText = styled.Text`
  ${TextS};
`;

const TitleIconContainer = styled.View<{ backgroundColor: string }>`
  border-color: ${({ backgroundColor }) => backgroundColor};
  padding: 12px;
  border-radius: 16px;
`;

const DropdownContainer = styled.View`
  z-index: 2; /* 👈 שים גבוה */
  position: relative;
  /* לאנדרואיד */
  elevation: 10;
`;

const DateSelectionContainer = styled.View``;

const DateInputContainer = styled.View`
  padding: 16px;
  background: ${White};
  border-radius: 8px;
  border: 1px solid ${Gray4};
`;

const Label = styled.Text`
  ${TextM};
`;

const DateInputValue = styled.Text`
  ${TextM};
`;

const IconRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export default SettingsScreen;
