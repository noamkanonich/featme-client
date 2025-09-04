// components/Dropdown.tsx
import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  Pressable,
  ViewStyle,
} from 'react-native';
import styled from 'styled-components/native';
import { TextM, TextS } from '../../theme/typography';
import Spacer from '../spacer/Spacer';

export type Option<T = string> = { label: string; value: T };

export type DropdownProps<T = string> = {
  label?: string;
  value: T | null;
  options: Option<T>[];
  onChange: (v: T) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: ViewStyle;
};

const Dropdown = <T,>({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select…',
  disabled = false,
  style,
}: DropdownProps<T>) => {
  const [open, setOpen] = useState(false);
  const [triggerH, setTriggerH] = useState(48);
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(-6)).current;
  const caret = useRef(new Animated.Value(0)).current; // 0=closed, 1=open

  const selectedLabel = useMemo(
    () => options.find(o => o.value === value)?.label ?? '',
    [options, value],
  );

  const startOpen = () => {
    setOpen(true);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 140,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration: 140,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(caret, {
        toValue: 1,
        duration: 140,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startClose = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 120,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: -6,
        duration: 120,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(caret, {
        toValue: 0,
        duration: 120,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => finished && setOpen(false));
  };

  const toggle = () => {
    if (disabled) return;
    open ? startClose() : startOpen();
  };

  const onPick = (v: T) => {
    onChange(v);
    startClose();
  };

  const caretRotate = caret.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const onMeasure = (e: LayoutChangeEvent) =>
    setTriggerH(e.nativeEvent.layout.height);

  return (
    <Wrap style={style}>
      {!!label && <Label>{label}</Label>}
      <Spacer direction="vertical" size="xs" />
      <Trigger
        onLayout={onMeasure}
        $disabled={!!disabled}
        $open={open}
        onPress={toggle}
      >
        <TriggerText $placeholder={!selectedLabel}>
          {selectedLabel || placeholder}
        </TriggerText>
        <Animated.View style={{ transform: [{ rotate: caretRotate }] }}>
          <Caret>▾</Caret>
        </Animated.View>
      </Trigger>

      {open && (
        <>
          {/* backdrop to close when tapping outside */}
          <Backdrop onPress={startClose} />
          <Menu
            style={{ opacity, transform: [{ translateY: translate }] }}
            $top={triggerH + 6}
          >
            {options.map(opt => {
              const isSelected = opt.value === value;
              return (
                <Item key={String(opt.label)} onPress={() => onPick(opt.value)}>
                  <ItemLabel>{opt.label}</ItemLabel>
                  {isSelected && <Check>✓</Check>}
                </Item>
              );
            })}
          </Menu>
        </>
      )}
    </Wrap>
  );
};

export default Dropdown;

const Wrap = styled.View`
  position: relative;
  width: 100%;
`;

const Label = styled.Text`
  ${TextS};
`;

const Trigger = styled(Pressable)<{ $open: boolean; $disabled: boolean }>`
  min-height: 48px;
  padding: 8px;
  border-radius: 16px;
  background: #ffffff;
  border-width: ${p => (p.$open ? 2 : 1)}px;
  border-color: ${p => (p.$open ? '#111827' : '#E5E7EB')}; /* gray-100 */
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  opacity: ${p => (p.$disabled ? 0.6 : 1)};

  /* subtle focus shadow */
  shadow-color: #000;
  shadow-opacity: ${p => (p.$open ? 0.12 : 0)};
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  elevation: ${p => (p.$open ? 2 : 0)};
`;

const TriggerText = styled.Text<{ $placeholder?: boolean }>`
  ${TextS};
  color: ${p => (p.$placeholder ? '#9CA3AF' : '#111827')};
`;

const Caret = styled.Text`
  font-size: 16px;
  color: #6b7280; /* gray-500 */
`;

const Backdrop = styled.Pressable`
  position: absolute;
`;

const Menu = styled(Animated.View)<{ $top: number }>`
  position: absolute;
  left: 0;
  right: 0;
  top: ${p => p.$top}px;
  background: #ffffff;
  border-radius: 14px;
  border-width: 1px;
  border-color: #e5e7eb;
  padding: 6px;
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 12px;
  shadow-offset: 0px 6px;
  elevation: 3;
  z-index: 10;
`;

const Item = styled.Pressable`
  height: 44px;
  border-radius: 10px;
  padding: 0 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ItemLabel = styled.Text`
  font-size: 16px;
  color: #111827;
`;

const Check = styled.Text`
  font-size: 16px;
  color: #111827;
`;
