import React, { memo, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';
import styled from 'styled-components/native';

interface IStepIndicator {
  total: number; // total steps
  current: number; // 0-based active step
  activeColor?: string; // default: emerald-500
  inactiveColor?: string; // default: gray-300
  dotSize?: number; // default: 10
  spacing?: number; // default: 12
  barWidth?: number; // default: 36
  style?: ViewStyle;
}

export const StepIndicator = memo(
  ({
    total,
    current,
    activeColor = '#10B981',
    inactiveColor = '#D1D5DB',
    dotSize = 10,
    spacing = 12,
    barWidth = 36,
    style,
  }: IStepIndicator) => {
    const barAnim = useRef(new Animated.Value(0)).current;

    // Animate bar whenever current step changes
    useEffect(() => {
      barAnim.stopAnimation();
      barAnim.setValue(0);
      Animated.timing(barAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false, // width animation needs layout (not transform)
      }).start();
    }, [current, barAnim]);

    const steps = useMemo(() => Array.from({ length: total }), [total]);

    return (
      <Row style={style}>
        {steps.map((_, idx) => {
          const isActive = idx + 1 === current;
          const isFuture = idx + 1 > current;

          // Completed steps (idx < current) = solid dots in activeColor
          if (!isActive) {
            return (
              <DotWrap key={idx * 1} spacing={spacing}>
                <Dot
                  size={dotSize}
                  color={isFuture ? inactiveColor : activeColor}
                />
              </DotWrap>
            );
          }

          // Active step = dot + animated pill
          const animatedWidth = barAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, barWidth],
          });

          return (
            <ActiveWrap key={idx} spacing={spacing}>
              <Dot size={dotSize} color={activeColor} />
              <Animated.View
                style={{
                  width: animatedWidth,
                  height: dotSize,
                  marginLeft: Math.max(4, Math.round(spacing / 3)),
                  borderRadius: dotSize / 2,
                  backgroundColor: activeColor,
                }}
              />
            </ActiveWrap>
          );
        })}
      </Row>
    );
  },
);

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DotWrap = styled.View<{ spacing: number }>`
  margin-right: ${({ spacing }) => spacing}px;
`;

const ActiveWrap = styled.View<{ spacing: number }>`
  flex-direction: row;
  align-items: center;
  margin-right: ${({ spacing }) => spacing}px;
`;

const Dot = styled.View<{ size: number; color: string }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => Math.round(size / 2)}px;
  background-color: ${({ color }) => color};
`;

export default StepIndicator;
