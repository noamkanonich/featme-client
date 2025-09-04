import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import React from 'react';
import styled from 'styled-components/native';
import { Gray1, Gray4, Gray7, White } from '../../theme/colors';
import { TextM } from '../../theme/typography';
import { SvgProps } from 'react-native-svg';
import Spacer from '../spacer/Spacer';
import LinearGradient from 'react-native-linear-gradient';

interface ICustomButton {
  label: string;
  onPress: () => void;
  type?: 'primary' | 'secondary';
  backgroundColor?: string; // solid background for primary
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  startIcon?: React.FC<SvgProps>;
  endIcon?: React.FC<SvgProps>;
}

const CustomButton = ({
  label,
  type = 'primary',
  color,
  backgroundColor,
  loading,
  disabled = false,
  startIcon: StartIcon,
  endIcon: EndIcon,
  onPress,
}: ICustomButton) => {
  const useSolid = type === 'secondary' || !!backgroundColor;
  const solidColor = type === 'secondary' ? Gray4 : backgroundColor || White;

  const textColor = type === 'secondary' ? Gray1 : color || White;
  const iconColor = color || White;

  return (
    <Root>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={{ width: '100%' }}
      >
        <Container
          $useSolid={useSolid}
          $solidColor={solidColor}
          $disabled={disabled}
        >
          {loading ? (
            <ActivityIndicator size={24} color={textColor} />
          ) : (
            <Row>
              {StartIcon && (
                <>
                  <StartIcon width={24} height={24} fill={iconColor} />
                  <Spacer direction="horizontal" size="s" />
                </>
              )}
              <ButtonLabel $color={textColor}>{label}</ButtonLabel>
              {EndIcon && (
                <>
                  <Spacer direction="horizontal" size="s" />
                  <EndIcon width={24} height={24} fill={iconColor} />
                </>
              )}
            </Row>
          )}
        </Container>
      </Pressable>
    </Root>
  );
};

const Root = styled.View`
  width: 100%;
`;

const Container = styled(LinearGradient).attrs<{
  $useSolid: boolean;
  $solidColor: string;
}>(p => ({
  colors: p.$useSolid ? [p.$solidColor, p.$solidColor] : ['#34D399', '#10B981'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
}))<{
  $disabled?: boolean;
}>`
  width: 100%;
  border-radius: 16px;
  padding: 16px;
  align-items: center;
  justify-content: center;
  max-height: 64px;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`;

const ButtonLabel = styled.Text<{ $color: string }>`
  ${TextM};
  color: ${({ $color }) => $color};
  font-weight: bold;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export default CustomButton;
