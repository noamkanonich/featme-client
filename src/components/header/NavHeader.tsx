import { View, Text, Pressable } from 'react-native';
import React from 'react';
import styled from '../../../styled-components';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../i18n';
import ChevronRightIcon from '../../../assets/icons/chevron-right.svg';
import ChevronLeftIcon from '../../../assets/icons/chevron-left.svg';
import { Dark, Gray4 } from '../../theme/colors';

const NavHeader = () => {
  const isRtl = i18n.dir() === 'rtl';
  const navigation = useNavigation();

  const ChevronIcon = isRtl ? ChevronRightIcon : ChevronLeftIcon;
  return (
    <Root>
      <Pressable onPress={() => navigation.goBack()}>
        <IconContainer>
          <ChevronIcon width={24} height={24} fill={Dark} />
        </IconContainer>
      </Pressable>
    </Root>
  );
};

const Root = styled.View`
  position: absolute;
  left: 10;
  top: 15;
  z-index: 10;
`;

const IconContainer = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${Gray4};
`;
export default NavHeader;
