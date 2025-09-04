import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import styled from 'styled-components/native';
import { UnitType } from '../../data/UnitType';
import { White } from '../../theme/colors';
import { TextS } from '../../theme/typography';

interface ISwitchButton {
  value: UnitType;
  onChange: (next: UnitType) => void;
  disabled?: boolean;
  labels?: { metric: string; imperial: string };
}

const TRACK_H = 56;
const PADDING = 6;
const TRACK_RADIUS = 12; // reduced radius
const THUMB_RADIUS = 10; // reduced radius

const SwitchButton = ({
  value,
  onChange,
  disabled,
  labels = { metric: 'Metric', imperial: 'Imperial' },
}: ISwitchButton) => {
  const anim = useRef(
    new Animated.Value(value === UnitType.Metric ? 0 : 1),
  ).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value === UnitType.Metric ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, anim]);

  const translateX = useMemo(
    () =>
      anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1], // scaled later by travel distance
      }),
    [anim],
  );

  const trackW = useRef(0);
  const thumbW = useRef(0);

  const onTrackLayout = (w: number) => (trackW.current = w);
  const onThumbLayout = (w: number) => (thumbW.current = w);

  const getTransform = () => {
    const travel =
      Math.max(trackW.current - thumbW.current - PADDING * 2, 0) || 0;
    return [{ translateX: Animated.multiply(translateX, travel) }];
  };

  return (
    <Track
      accessible
      accessibilityRole="tablist"
      $disabled={!!disabled}
      onLayout={e => onTrackLayout(e.nativeEvent.layout.width)}
    >
      <Thumb
        style={{ transform: getTransform() }}
        onLayout={e => onThumbLayout(e.nativeEvent.layout.width)}
      />

      <Row>
        <Segment
          as={Pressable}
          onPress={() => !disabled && onChange(UnitType.Metric)}
        >
          <Label $active={value === UnitType.Metric}>{labels.metric}</Label>
        </Segment>

        <Segment
          as={Pressable}
          onPress={() => !disabled && onChange(UnitType.Imperial)}
        >
          <Label $active={value === UnitType.Imperial}>{labels.imperial}</Label>
        </Segment>
      </Row>
    </Track>
  );
};

/* ---------- styles ---------- */
const Track = styled.View<{ $disabled: boolean }>`
  height: ${TRACK_H}px;
  padding: ${PADDING}px;
  border-radius: ${TRACK_RADIUS}px;
  background: #f3f4f6; /* gray-100 */
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  position: relative;
  width: 75%;
  align-self: center; /* center horizontally */
`;

const Row = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center; /* vertical center */
  justify-content: space-between;
  position: relative;
`;

const Segment = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  z-index: 2; /* keep text above the thumb */
`;

const Thumb = styled(Animated.View)`
  position: absolute;
  top: ${PADDING}px;
  left: ${PADDING}px;
  height: ${TRACK_H - PADDING * 2}px;
  width: 48%;
  border-radius: ${THUMB_RADIUS}px;
  background: ${White};

  /* soft shadow */
  shadow-color: #000;
  shadow-opacity: 0.12;
  shadow-radius: 6px;
  shadow-offset: 0px 3px;
  elevation: 1; /* Android */
`;

const Label = styled.Text<{ $active: boolean }>`
  ${TextS};
  text-align: center;
  include-font-padding: false; /* Android vertical tweak */
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  color: ${({ $active }) => ($active ? '#059669' : '#374151')};
`;

export default SwitchButton;
