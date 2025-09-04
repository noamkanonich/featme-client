import { ActivityIndicator } from 'react-native';
import React from 'react';
import { Dark, Gray7 } from '../../theme/colors';
import styled from '../../../styled-components';

const LoadingScreen = () => {
  return (
    <Root>
      <ActivityIndicator size={64} color={Dark} />
    </Root>
  );
};

const Root = styled.View`
  flex: 1;
  background: ${Gray7};
  align-items: center;
  justify-content: center;
`;

export default LoadingScreen;
