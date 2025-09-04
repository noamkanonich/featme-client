import './styled-components';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    media: {
      isMobile: boolean;
      isTablet: boolean;
      isDesktop: boolean;
    };
    dir: 'ltr' | 'rtl';
  }
}
