import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import i18n from '../../i18n';

type Option<T> = { value: T; label: string };

type Props<T> = {
  value: T;
  options: Option<T>[];
  onChange: (next: T) => void;
  disabled?: boolean;
  labelsUppercase?: boolean;

  // Optional styling overrides
  trackStyle?: ViewStyle;
  thumbStyle?: ViewStyle;
  activeTextColor?: string; // default: '#059669'
  inactiveTextColor?: string; // default: '#374151'
  trackColor?: string; // default: '#f3f4f6'
  thumbColor?: string; // default: '#ffffff'
  height?: number; // default: 44
  padding?: number; // default: 4
  radius?: number; // default: 12
};

function SegmentedSwitch<T>({
  value,
  options,
  onChange,
  disabled,
  labelsUppercase = false,
  trackStyle,
  thumbStyle,
  activeTextColor = '#059669',
  inactiveTextColor = '#374151',
  trackColor = '#f3f4f6',
  thumbColor = '#ffffff',
  height = 44,
  padding = 4,
  radius = 12,
}: Props<T>) {
  const isRtl = i18n.dir() === 'rtl';
  const count = Math.max(1, options.length);
  const selectedIndex = Math.max(
    0,
    options.findIndex(o => o.value === value),
  );

  // Animated index (0..count-1)
  const anim = useRef(new Animated.Value(selectedIndex)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: selectedIndex,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [selectedIndex, anim]);

  const [trackW, setTrackW] = useState(0);

  const segmentW = useMemo(() => {
    const inner = Math.max(trackW - padding * 2, 0);
    return count > 0 ? inner / count : inner;
  }, [trackW, padding, count]);

  const translateX = useMemo(
    () =>
      anim.interpolate({
        inputRange: Array.from({ length: count }, (_, i) => i),
        outputRange: Array.from(
          { length: count },
          (_, i) => i * (isRtl ? -segmentW : segmentW),
        ),
      }),
    [anim, count, segmentW, isRtl],
  );

  return (
    <Track
      accessible
      accessibilityRole="tablist"
      $disabled={!!disabled}
      style={[
        {
          height,
          padding,
          borderRadius: radius,
          backgroundColor: trackColor,
        },
        trackStyle,
      ]}
      onLayout={e => setTrackW(e.nativeEvent.layout.width)}
    >
      {/* Thumb */}
      <Thumb
        style={[
          {
            transform: [{ translateX }],
            height: Math.max(height - padding * 2, 0),
            width: Math.max(segmentW, 0),
            left: padding,
            top: padding,
            borderRadius: radius - 2,
            backgroundColor: thumbColor,
          },
          thumbStyle,
        ]}
      />

      {/* Segments */}
      <Row>
        {options.map((opt, idx) => {
          const active = idx === selectedIndex;
          return (
            <Segment
              key={String(idx)}
              as={Pressable}
              accessibilityRole="tab"
              accessibilityState={{ selected: active, disabled: !!disabled }}
              onPress={() => !disabled && onChange(opt.value)}
            >
              <Label
                $active={active}
                $activeColor={activeTextColor}
                $inactiveColor={inactiveTextColor}
                $uppercase={labelsUppercase}
              >
                {opt.label}
              </Label>
            </Segment>
          );
        })}
      </Row>
    </Track>
  );
}

const Track = styled.View<{ $disabled: boolean }>`
  position: relative;
  width: 100%;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Segment = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  z-index: 2;
  padding: 10px;
`;

const Thumb = styled(Animated.View)`
  position: absolute;

  /* soft shadow */
  shadow-color: #000;
  shadow-opacity: 0.12;
  shadow-radius: 6px;
  shadow-offset: 0px 3px;
  elevation: 1;
`;

const Label = styled.Text<{
  $active: boolean;
  $activeColor: string;
  $inactiveColor: string;
  $uppercase: boolean;
}>`
  text-align: center;
  include-font-padding: false;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  color: ${({ $active, $activeColor, $inactiveColor }) =>
    $active ? $activeColor : $inactiveColor};
  text-transform: ${({ $uppercase }) => ($uppercase ? 'uppercase' : 'none')};
`;

export default SegmentedSwitch;
