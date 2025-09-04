import React from 'react';
import styled from '../../../styled-components';
import { Direction, Size, Spacing } from '../../theme/layout';

interface SpacerProps {
  direction: Direction;
  size: Size;
}

function getProperty(direction: Direction) {
  return direction === 'vertical' ? 'height' : 'width';
}

const View = styled.View<{ size: Size; spacerDirection: Direction }>`
  ${({ spacerDirection, size }) =>
    `${getProperty(spacerDirection)}:${Spacing[size]}px`};
`;

const Spacer = ({ size = 'xs', direction = 'vertical' }: SpacerProps) => {
  return <View size={size} spacerDirection={direction} />;
};

export default Spacer;
