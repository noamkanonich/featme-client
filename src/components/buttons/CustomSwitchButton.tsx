import React, { useEffect, useRef } from 'react';
import { Animated, Platform } from 'react-native';
import CheckIcon from '../../../assets/icons/check.svg';
import styled from '../../../styled-components';
import { Gray2, Green, White } from '../../theme/colors';

const WIDTH = 52;
const HEIGHT = 32;
const PADDING = 2;
const THUMB_SIZE = HEIGHT - PADDING * 2;

interface SwitchProps {
  value: boolean;
  disabled?: boolean;
  onChange?: () => void;
}

const CustomSwitchButton = ({
  disabled = false,
  onChange,
  value,
}: SwitchProps) => {
  const thumbLocationX = useRef(new Animated.Value(value ? 0 : 1)).current;
  const trackColor = useRef(new Animated.Value(value ? 0 : 1)).current;

  const thumbLocationInterpolation = thumbLocationX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -(WIDTH - THUMB_SIZE - PADDING * 2)],
  });
  const trackColorInterpolation = trackColor.interpolate({
    inputRange: [0, 1],
    outputRange: [Green, Gray2],
  });

  useEffect(() => {
    Animated.timing(trackColor, {
      toValue: value ? 0 : 1,
      useNativeDriver: false,
      duration: 100,
    }).start();

    Animated.timing(thumbLocationX, {
      toValue: value ? 0 : 1,
      useNativeDriver: Platform.OS !== 'web',
      duration: 100,
    }).start();
  }, [thumbLocationX, value, trackColor]);

  return (
    <Pressable
      disabled={disabled}
      onPress={onChange}
      dataSet={{ nagish: `toggle ${value ? 'on' : 'off'}` }}
    >
      <SwitchTrack style={{ backgroundColor: trackColorInterpolation }}>
        <SwitchThumbWrapper>
          <SwitchThumb
            style={{ transform: [{ translateX: thumbLocationInterpolation }] }}
          >
            <CheckIcon
              width={24}
              height={18}
              fill={value ? Green : 'none'}
              stroke={value ? Green : 'none'}
            />
          </SwitchThumb>
        </SwitchThumbWrapper>
      </SwitchTrack>
    </Pressable>
  );
};

const Pressable = styled.Pressable`
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
`;

const SwitchTrack = styled(Animated.View)`
  width: 100%;
  height: 100%;
  padding: ${PADDING}px;
  border-radius: ${HEIGHT}px;
`;

const SwitchThumbWrapper = styled(Animated.View)`
  ${({ theme }: { theme: any }) =>
    theme.dir === 'ltr' &&
    `
      transform: translateX(${WIDTH - THUMB_SIZE - PADDING * 2}px)
    `};
`;

const SwitchThumb = styled(Animated.View)`
  align-items: center;
  justify-content: center;
  height: ${THUMB_SIZE}px;
  width: ${THUMB_SIZE}px;
  border-radius: ${THUMB_SIZE}px;
  background-color: ${White};
`;

export default CustomSwitchButton;
