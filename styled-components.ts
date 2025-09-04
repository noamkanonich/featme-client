/* eslint-disable no-restricted-imports */
import * as styledComponents from 'styled-components/native';
import { DefaultTheme } from 'styled-components/native';

const {
  default: styled,
  css,
  ThemeProvider,
  useTheme,
} = styledComponents as styledComponents.ReactNativeThemedStyledComponentsModule<DefaultTheme>;

export { useTheme, css, ThemeProvider };
export default styled;
