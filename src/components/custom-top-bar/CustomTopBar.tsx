import { View, Image } from 'react-native';
import React from 'react';
import { White } from '../../theme/colors';
import styled from 'styled-components/native';
import { TextL, TextSLight } from '../../theme/typography';
import Spacer from '../spacer/Spacer';

const CustomTopBar = () => {
  return (
    <Root>
      <Spacer direction="vertical" size="s" />
      <Row>
        <IconBox>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 16,
            }}
            resizeMode="cover"
          />
        </IconBox>
        <Spacer direction="horizontal" size="s" />
        <View>
          <Title>FeatMe</Title>
          <Subtitle>AI-Powered Nutrition</Subtitle>
        </View>
      </Row>
    </Root>
  );
};

const Root = styled.View`
  padding: 16px 20px;
  background-color: ${White};
  shadow-color: #000;
  shadow-opacity: 0.12;
  shadow-radius: 6px;
  shadow-offset: 0px 3px;
  elevation: 1; /* Android */
`;

const Row = styled.View`
  top: 8;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const IconBox = styled.View`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  ${TextL};
  font-weight: bold;
`;

const Subtitle = styled.Text`
  ${TextSLight};
  font-size: 11px;
`;
export default CustomTopBar;
