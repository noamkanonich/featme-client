import React, { useState, forwardRef } from 'react';
import {
  Platform,
  Pressable,
  TextInput as RNTextInput,
  TextInputProps,
} from 'react-native';
import styled from 'styled-components/native';
import { TextM, TextS } from '../../theme/typography';
import Spacer from '../spacer/Spacer';
import { SvgProps } from 'react-native-svg';
import { Dark, Gray2, White } from '../../theme/colors';
import i18n from '../../i18n';

type CustomInputProps = Omit<
  TextInputProps,
  'value' | 'onChangeText' | 'keyboardType'
> & {
  label: string;
  value: string | number;
  startIcon?: React.FC<SvgProps>;
  endIcon?: React.FC<SvgProps>;
  onChangeText: (t: string) => void;
  isPassword?: boolean;
  numeric?: boolean; // show numeric keypad
  onPressEndIcon?: () => void;
  type?: 'text' | 'password' | 'numeric' | 'date' | 'email';
};

const CustomInput = forwardRef<RNTextInput, CustomInputProps>(
  (
    {
      label,
      value,
      onChangeText,
      startIcon: StartIcon,
      endIcon: EndIcon,
      isPassword = false,
      numeric = false,
      onPressEndIcon,
      type,
      ...rest
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const isRtl = i18n.dir() === 'rtl';

    return (
      <Root>
        <Label>{label}</Label>
        <Spacer direction="vertical" size="xs" />
        <Field $focused={focused} hasIcons={!!StartIcon || !!EndIcon}>
          <Input
            ref={ref}
            isRtl={isRtl}
            hasIcons={!!StartIcon || !!EndIcon}
            value={value === undefined || value === null ? '' : String(value)}
            onChangeText={onChangeText}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            type={type}
            secureTextEntry={rest.secureTextEntry}
            keyboardType={
              numeric
                ? Platform.OS === 'ios'
                  ? 'number-pad'
                  : 'numeric'
                : rest.keyboardType
            }
            // RN Web: show numeric keypad without spinners
            // @ts-ignore
            inputMode={numeric ? 'numeric' : undefined}
            placeholderTextColor={Gray2}
            style={[
              { color: Dark },
              Platform.OS === 'android' &&
              rest.secureTextEntry &&
              value.length > 0
                ? { fontSize: 14 }
                : null,
            ]}
            {...rest}
          />

          {StartIcon && (
            <StartIconContainer>
              <StartIcon width={20} height={20} stroke={Gray2} />
            </StartIconContainer>
          )}
          {EndIcon && (
            <EndIconContainer>
              <Pressable onPress={onPressEndIcon}>
                <EndIcon width={20} height={20} stroke={Gray2} />
              </Pressable>
            </EndIconContainer>
          )}
          {/* {isPassword ? <></> : <></>} */}
        </Field>
      </Root>
    );
  },
);

const Root = styled.View`
  flex: 1;
  width: 100%;
`;

const Label = styled.Text`
  ${TextM};
  font-weight: 600;
`;

const Field = styled.View<{ $focused: boolean; hasIcons?: boolean }>`
  background-color: ${White};

  border-radius: 8px;
  border-width: ${p => (p.$focused ? 2 : 1)}px;
  border-color: ${p => (p.$focused ? '#111827' : '#E5E7EB')}; /* gray-100 */
  padding: ${({ hasIcons }) => (hasIcons ? '6px 14px' : '6px 10px')};

  justify-content: center;

  /* iOS shadow when focused */
  shadow-color: ${Dark};
  shadow-opacity: ${p => (p.$focused ? 0.12 : 0)};
  shadow-radius: 8px;
  shadow-offset: 0px 4px;

  /* Android */
  elevation: ${p => (p.$focused ? 2 : 0)};
`;

const Input = styled.TextInput<{ isRtl?: boolean; hasIcons?: boolean }>`
  ${TextM};
  text-align: ${({ isRtl }) => (isRtl ? 'right' : 'left')};
  padding: ${({ hasIcons }) => (hasIcons ? '10px 20px' : '10px 5px')};
`;

const StartIconContainer = styled.View`
  position: absolute;
  left: 10px;
`;

const EndIconContainer = styled.View`
  position: absolute;
  right: 15px;
`;

export default CustomInput;
