import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import styled from 'styled-components/native';

type ProgressBarProps = {
  value: number; // current value
  maxValue: number; // maximum value
  style?: ViewStyle; // let parent control width/layout
  height?: number; // bar height
  trackColor?: string; // background color
  fillColor?: string; // progress color
  duration?: number; // animation duration (ms)
};

const ProgressBar = ({
  value,
  maxValue,
  style,
  height = 8,
  trackColor = '#EEF2F7',
  fillColor = '#10B981',
  duration = 500,
}: ProgressBarProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const percent =
    maxValue > 0 ? Math.max(0, Math.min(100, (value / maxValue) * 100)) : 0;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percent,
      duration,
      useNativeDriver: false,
    }).start();
  }, [percent, duration, animatedValue]);

  return (
    <Track style={[{ height, backgroundColor: trackColor }, style]}>
      <Fill
        style={{
          backgroundColor: fillColor,
          width: animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }),
        }}
      />
    </Track>
  );
};

/* styles */
const Track = styled(Animated.View)`
  flex: 1;
  border-radius: 999px;
  overflow: hidden;
`;

const Fill = styled(Animated.View)`
  height: 100%;
  border-radius: 999px;
`;

export default ProgressBar;
