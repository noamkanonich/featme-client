import React from 'react';
import { Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import styled, { css } from '../../../styled-components';
import { TextS } from '../../theme/typography';
import { Gray1, Gray4, Green, LightGreen, White } from '../../theme/colors';
import HomeIcon from '../../../assets/icons/nav-bar/navigation-home.svg';
import AccountIcon from '../../../assets/icons/nav-bar/navigation-account.svg';
import HistoryIcon from '../../../assets/icons/nav-bar/navigation-history.svg';
import Spacer from '../spacer/Spacer';
import { useTranslation } from 'react-i18next';
import PlusButton from '../buttons/PlusButton';
import InsightsIcon from '../../../assets/icons/nav-bar/navigation-insights.svg';
import ChefIcon from '../../../assets/icons/nav-bar/navigation-chef.svg';

const IconComponent = ({
  name,
  isFocused,
}: {
  name: string;
  isFocused: boolean;
}) => {
  switch (name) {
    case 'Home':
      return (
        <HomeIcon width={28} height={28} fill={isFocused ? Green : Gray1} />
      );
    case 'Recipes':
      return (
        <ChefIcon width={24} height={24} fill={isFocused ? Green : Gray1} />
      );
    case 'History':
      return (
        <HistoryIcon width={24} height={24} fill={isFocused ? Green : Gray1} />
      );

    case 'Insights':
      return (
        <InsightsIcon width={26} height={26} fill={isFocused ? Green : Gray1} />
      );
    case 'Profile':
      return (
        <AccountIcon width={22} height={22} fill={isFocused ? Green : Gray1} />
      );

    default:
      return null;
  }
};

const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const { t } = useTranslation();

  const tabs = [
    {
      name: 'Home',
      label: t('bottom_tab.dashboard'),
    },
    {
      name: 'Recipes',
      label: t('bottom_tab.recipes'),
    },
    {
      name: 'History',
      label: t('bottom_tab.history'),
    },
    {
      name: 'Insights',
      label: t('bottom_tab.insights'),
    },
    {
      name: 'Profile',
      label: t('bottom_tab.profile'),
    },
  ];

  const handlePlusButtonPress = () => {
    navigation.navigate('AddFood');
  };
  return (
    <TabBarContainer>
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;
        const onPress = () => {
          navigation.navigate(tab.name as never);
        };

        return (
          <Tab
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            isActive={isFocused}
            isReduced={tab.name === 'Notifications'}
          >
            <IconContainer>
              <IconComponent name={tab.name} isFocused={isFocused} />
            </IconContainer>
            <Spacer direction="vertical" size="xs" />
            <Label isActive={isFocused} allowFontScaling={false}>
              {tab.label}
            </Label>
          </Tab>
        );
      })}

      <PlusButton onPress={handlePlusButtonPress} />
    </TabBarContainer>
  );
};

const TabBarContainer = styled.View`
  padding: 8px;
  border: 1px solid ${Gray4};
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: ${White};
  elevation: 1;
`;

const Tab = styled(Pressable)<{ isActive: boolean; isReduced?: boolean }>`
  flex: 1;
  min-height: 56px;
  align-items: center;
  padding: 4px;
  justify-content: center;
  margin: 0px 3px;
  border-radius: 8px;
  ${({ isActive }: { isActive: boolean }) =>
    `background-color: ${isActive ? LightGreen : White}`};
  ${({ isReduced }: { isReduced: boolean }) =>
    isReduced &&
    css`
      padding: 2px;
      margin: 0px;
    `};
`;

const Label = styled.Text<{ isActive: boolean }>`
  ${TextS};
  flex: 1;
  ${({ isActive }: { isActive: boolean }) =>
    `color: ${isActive ? Green : Gray1}`};
`;

const IconContainer = styled.View`
  flex: 1;
`;

export default CustomTabBar;
