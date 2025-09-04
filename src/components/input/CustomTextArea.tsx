// components/inputs/TextArea.tsx
import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import { TextM, TextS } from '../../theme/typography';
import Spacer from '../spacer/Spacer';
import i18n from '../../i18n';

type ICustomArea = Omit<
  TextInputProps,
  'value' | 'onChangeText' | 'multiline' | 'numberOfLines'
> & {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  rows?: number; // initial rows
  minHeight?: number;
  maxHeight?: number;
  autoGrow?: boolean;
  error?: boolean;
};

const CustomTextArea = ({
  label,
  value,
  onChangeText,
  rows = 5,
  minHeight,
  maxHeight = 200,
  autoGrow = true,
  error = false,
  ...rest
}: ICustomArea) => {
  const baseLine = 22; // line height
  const initH = minHeight ?? rows * baseLine + 8;
  const [focused, setFocused] = useState(false);
  const [height, setHeight] = useState(initH);
  const isRtl = i18n.dir() === 'rtl';

  return (
    <Wrap>
      {!!label && <Label>{label}</Label>}
      <Spacer direction="vertical" size="xxs" />
      <Field $focused={focused} $error={error}>
        <Input
          isRtl={isRtl}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline
          scrollEnabled
          numberOfLines={rows}
          style={{ height, textAlignVertical: 'top' as const }}
          placeholderTextColor="#9CA3AF"
          {...rest}
        />
      </Field>
    </Wrap>
  );
};

/* ---- styles ---- */
const Wrap = styled.View`
  width: 100%;
`;

const Label = styled.Text`
  ${TextM};
`;

const Field = styled.View<{ $focused: boolean; $error: boolean }>`
  background-color: #ffffff;
  border-radius: 16px;
  border-width: ${p => (p.$focused ? 2 : 1)}px;
  border-color: ${p =>
    p.$error ? '#EF4444' : p.$focused ? '#111827' : '#E5E7EB'};
  padding: 12px 14px;

  shadow-color: #000;
  shadow-opacity: ${p => (p.$focused ? 0.12 : 0)};
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  elevation: ${p => (p.$focused ? 2 : 0)};
`;

const Input = styled.TextInput<{ isRtl?: boolean }>`
  ${TextM};
  line-height: 22px;
  text-align: ${({ isRtl }) => (isRtl ? 'right' : 'left')};
  padding: 0px; /* keep spacing controlled by Field */
`;

export default CustomTextArea;
