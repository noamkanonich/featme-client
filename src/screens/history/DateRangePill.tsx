// components/DateRangePill.tsx
import React, { useRef } from 'react';
import { Animated, Easing, PressableProps } from 'react-native';
import styled from 'styled-components/native';
import { format } from 'date-fns';

// If you have an SVG icon, pass it in via props.
// Fallback: a tiny calendar emoji.
type IconComp = React.ComponentType<{
  width?: number;
  height?: number;
  color?: string;
}>;

type Props = {
  start: Date;
  end: Date;
  onPress?: () => void;
  icon?: IconComp;
  locale?: string; // for date-fns if you use locales
} & Omit<PressableProps, 'onPress'>;

const DateRangePill: React.FC<Props> = ({
  start,
  end,
  onPress,
  icon: Icon,
  locale,
  ...rest
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.timing(scale, {
      toValue: 0.98,
      duration: 90,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  const pressOut = () =>
    Animated.timing(scale, {
      toValue: 1,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

  const sameYear = start.getFullYear() === end.getFullYear();
  const rangeText = sameYear
    ? `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
    : `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pill
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        accessibilityRole="button"
        {...rest}
      >
        <Left>
          {Icon ? (
            <Icon width={18} height={18} color="#059669" />
          ) : (
            <IconFallback>📅</IconFallback>
          )}
        </Left>
        <Text>{rangeText}</Text>
      </Pill>
    </Animated.View>
  );
};

export default DateRangePill;

/* -------- styles -------- */
const Pill = styled.Pressable`
  background: #ffffff;
  border-radius: 999px;
  padding: 12px 16px;
  border-width: 1px;
  border-color: #e5e7eb; /* gray-200 */
  flex-direction: row;
  align-items: center;
  justify-content: center;

  /* subtle card shadow */
  shadow-color: #000;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  elevation: 2;
`;

const Left = styled.View`
  width: 22px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

const IconFallback = styled.Text`
  font-size: 16px;
`;

const Text = styled.Text`
  font-size: 16px;
  font-weight: 800;
  color: #0f172a; /* slate-900 */
`;
