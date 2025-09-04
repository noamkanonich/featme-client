import React, { ReactNode } from 'react';
import styled, { css } from '../../../../styled-components';
import { Primary } from '../../../theme/colors';
import { TextS } from '../../../theme/typography';
import { SvgProps } from 'react-native-svg';

interface BelowSliderCardProps {
  text: string;
  Icon: React.FC<SvgProps>;
  color: string;
  background: string;
  height?: string;
  width?: string;
  childern?: ReactNode;
  disabled?: boolean;
  onPress: () => void;
}

const BelowSliderCard = ({
  text,
  Icon,
  color,
  background,
  height = '100%',
  width = '100%',
  childern,
  disabled = false,
  onPress,
}: BelowSliderCardProps) => {
  return (
    <Root height={height} width={width}>
      <BackgroundColor background={background} />
      <Card background={background} disabled={disabled} onPress={onPress}>
        <Icon width={28} height={28} fill={color} />
        <Label color={color}>{text}</Label>
      </Card>
      {childern}
    </Root>
  );
};

const Root = styled.Pressable<{ height: string; width: string }>`
  ${({ theme, width }) =>
    theme.media.isMobile &&
    css`
      width: ${width};
      height: 100%;
    `}
  ${({ theme, height }) =>
    theme.media.isTablet &&
    css`
      width: 300px;
      height: ${height};
    `}
`;

const Card = styled.Pressable<{ background: string }>`
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  ${({ background }) => `background-color: ${background};`}
`;

const BackgroundColor = styled.Pressable<{ background: string }>`
  position: absolute;
  left: -16px;
  width: 32px;
  height: 100%;
  ${({ background }) => `background-color: ${background};`}
`;

const Label = styled.Text<{ background: string }>`
  ${TextS};
  ${({ color }) => `color: ${color};`}
  text-align: center;
`;

export default BelowSliderCard;
