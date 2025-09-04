import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  Modal as RNModal,
  Platform,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import styled, { css, useTheme } from '../../../styled-components';
import { Dark, White } from '../../theme/colors';
import { shadow } from '../../theme/utils';
import { Spacing } from '../../theme/layout';
import hexToRgba from 'hex-to-rgba';
import useMedia from '../../theme/useMedia';

interface ModalProps {
  visible: boolean;
  onRequestClose?: () => void;
  popupOnly?: boolean;
  isHidden?: boolean;
  children: ReactNode;
}

const Modal = ({
  visible: visibleProp,
  onRequestClose,
  popupOnly = false,
  isHidden = false,
  children,
}: ModalProps) => {
  const { dir } = useTheme();
  const { isMobile } = useMedia();
  const { height: deviceHeight } = useWindowDimensions();
  const [visible, setVisible] = useState(visibleProp);
  const modalType = isMobile && !popupOnly ? 'slide' : 'popup';
  const InnerView = modalType === 'popup' ? PopupView : SlideView;
  const anim = useRef(new Animated.Value(0.1));

  useEffect(() => {
    if (modalType !== 'slide') {
      setVisible(visibleProp);
      return;
    }

    if (visibleProp) {
      setVisible(true);
      anim.current.setValue(0.1);
      Animated.timing(anim.current, {
        toValue: 1,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else {
      anim.current.setValue(1);
      Animated.timing(anim.current, {
        toValue: 0.1,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => setVisible(false));
    }
  }, [visibleProp, modalType]);

  const slideUp = anim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [deviceHeight, 0],
  });

  const handleBackdropPress = useCallback(() => {
    if (onRequestClose) {
      onRequestClose();
    }
  }, [onRequestClose]);

  return (
    <RNModal
      visible={visible}
      transparent
      animationType={modalType === 'popup' ? 'fade' : 'none'}
      onRequestClose={onRequestClose}
    >
      <MenuProvider skipInstanceCheck>
        <Root modalType={modalType} dir={dir}>
          <Backdrop onPress={handleBackdropPress} removeClippedSubviews />
          <InnerView
            style={{
              transform: [{ translateY: modalType === 'slide' ? slideUp : 0 }],
            }}
            padding={!isHidden}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                padding: isHidden ? 0 : Spacing.l,
              }}
            >
              {children}
            </ScrollView>
          </InnerView>
        </Root>
      </MenuProvider>
    </RNModal>
  );
};

const Root = styled.View<{
  modalType: 'popup' | 'slide';
  dir: 'ltr' | 'rtl';
}>`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: ${({ modalType }) =>
    modalType === 'popup' ? 'center' : 'flex-end'};
`;

const Backdrop = styled.Pressable`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  background-color: ${hexToRgba(Dark, 0.2)};
`;

const InnerViewBase = styled(Animated.View)<{
  padding?: boolean;
}>`
  background-color: ${White};
  ${shadow({
    opacity: 0.2,
    offsetWidth: 0,
    offsetHeight: 3,
    radius: 8,
    elevation: '4',
  }) as {}};
  max-width: 100%;
  ${({ theme }) => theme.media.isMobile && 'max-height: 75%'};
`;

const PopupView = styled(InnerViewBase).attrs({ dataSet: { nagish: 'modal' } })`
  ${({ theme, padding }) =>
    theme.media.isMobile &&
    css`
      width: auto;
      border-radius: 16px;
      margin-horizontal: auto;
      ${padding && `padding: ${Spacing.xl}px ${Spacing.l}px`};
    `}
`;

const SlideView = styled(InnerViewBase).attrs({ dataSet: { nagish: 'modal' } })`
  width: 100%;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  padding: ${Spacing['xxl-4']}px ${Spacing.l}px ${Spacing.xl}px ${Spacing.l}px;
`;

export default Modal;
