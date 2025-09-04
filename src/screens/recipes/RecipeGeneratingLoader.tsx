// src/components/recipes/RecipeGeneratingLoader.tsx
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import ChefIcon from '../../../assets/icons/nav-bar/navigation-chef.svg';
import styled from '../../../styled-components';
import { Green } from '../../theme/colors';
import { TextL } from '../../theme/typography';
import Spacer from '../../components/spacer/Spacer';
import { useTranslation } from 'react-i18next';

const RecipeGeneratingLoader = () => {
  const { t } = useTranslation();
  const rot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rot, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ).start();
  }, [rot]);

  const spin = rot.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Wrap>
      <IconBox style={{ transform: [{ rotate: spin }] }}>
        <ChefIcon width={36} height={36} fill={Green} />
      </IconBox>
      <Spacer direction="vertical" size="xl" />
      <Msg>{t('recipes_screen.generating')}</Msg>
    </Wrap>
  );
};

export default RecipeGeneratingLoader;

const Wrap = styled.View`
  align-items: center;
  padding: 28px 0;
`;

const IconBox = styled(Animated.View)`
  width: 72px;
  height: 72px;
  border-radius: 32px;
  background: #ecfdf5;
  align-items: center;
  justify-content: center;
`;

const Msg = styled.Text`
  ${TextL};
  font-weight: bold;
`;
