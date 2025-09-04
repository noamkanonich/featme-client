import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { Green } from '../../theme/colors';

type ProgressBarProps = {
  percent: number;
  style?: ViewStyle; // let parent control width/layout
  height?: number;
  trackColor?: string;
  fillColor?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  style,
  height = 8,
  trackColor = '#EEF2F7',
  fillColor = Green,
}) => {
  const v = useRef(new Animated.Value(0)).current;
  const clamped = Math.max(
    0,
    Math.min(100, Number.isFinite(percent) ? percent : 0),
  );

  useEffect(() => {
    Animated.timing(v, {
      toValue: clamped,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [clamped, v]);

  return (
    <Track style={[{ height, backgroundColor: trackColor }, style]}>
      <Fill
        style={{
          backgroundColor: fillColor,
          width: v.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }),
        }}
      />
    </Track>
  );
};

export default ProgressBar;

/* styles */
const Track = styled(Animated.View)`
  flex: 1; /* so it grows in a row next to the % text */
  border-radius: 999px;
  overflow: hidden;
`;

const Fill = styled(Animated.View)`
  height: 100%;
  border-radius: 999px;
`;
