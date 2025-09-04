import {Platform, StyleProp, ViewStyle} from 'react-native';
import hexToRgba from 'hex-to-rgba';

export const shadow = ({
  color = '#000',
  opacity = 0,
  radius = 8,
  offsetWidth = 0,
  offsetHeight = 0,
  elevation = '1',
}) => {
  return Platform.select({
    ios: {
      shadowColor: color,
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: {
        width: offsetWidth,
        height: offsetHeight,
      },
    },
    android: {
      elevation,
    },
    web: {
      boxShadow: `${offsetWidth}px ${offsetHeight}px ${radius}px ${hexToRgba(
        color,
        opacity,
      )}`,
    },
  }) as {[key: string]: StyleProp<ViewStyle>};
};

export const createBuildingPickerStyle = (
  media: {isMobile: boolean},
  dir: 'ltr' | 'rtl',
) =>
  media.isMobile
    ? {
        width: '100%',
      }
    : dir === 'ltr'
      ? {
          position: 'fixed',
          width: 480,
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
        }
      : {
          position: 'fixed',
          width: 480,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
        };

export const createDrawerStyle = (
  media: {isMobile: boolean},
  dir: 'ltr' | 'rtl',
) =>
  media.isMobile
    ? {
        width: '100%',
      }
    : dir === 'ltr'
      ? {
          width: 480,
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
        }
      : {
          width: 480,
          left: 0,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
        };

export const createDrawerPosition = (dir: 'ltr' | 'rtl') =>
  dir === 'ltr' ? 'left' : 'right';

export const getMarginStart = (dir: 'ltr' | 'rtl') =>
  dir === 'ltr' ? 'margin-left' : 'margin-right';

export const getMarginEnd = (dir: 'ltr' | 'rtl') =>
  dir === 'ltr' ? 'margin-right' : 'margin-left';
