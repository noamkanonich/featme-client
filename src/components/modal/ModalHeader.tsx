import { Pressable } from 'react-native';
import CloseIcon from '../../../assets/icons/close.svg';
import { Dark } from '../../theme/colors';
import React from 'react';
import styled from '../../../styled-components';
import { HeadingM } from '../../theme/typography';

interface ModalHeaderProps {
  title: string;
  onRequestClose?: () => void;
}

const ModalHeader = ({ title, onRequestClose }: ModalHeaderProps) => {
  return (
    <Root>
      <Title>{title}</Title>
      {onRequestClose && (
        <Pressable onPress={() => onRequestClose()}>
          <CloseButton>
            <CloseIcon width={22} height={22} fill={Dark} />
          </CloseButton>
        </Pressable>
      )}
    </Root>
  );
};

const Root = styled.View.attrs({ dataSet: { nagish: 'header' } })`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const CloseButton = styled.View.attrs({ dataSet: { nagish: 'close-btn' } })`
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text.attrs({ dataSet: { nagish: 'title' } })`
  ${HeadingM}
`;

export default ModalHeader;
