import {
  Animated,
  useWindowDimensions,
  Easing,
  PanResponder,
  Platform,
  Pressable,
  Dimensions,
} from 'react-native';
import React, { useRef, useState } from 'react';
import {
  Blue,
  Gray4,
  LightBlue,
  LightPurple,
  Purple,
} from '../../../theme/colors';
import { SvgProps } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import EditIcon from '../../../../assets/icons/edit.svg';
import CloseIcon from '../../../../assets/icons/close.svg';
import ISliderCardProps from './ISliderCardProps';
import i18n from '../../../i18n';
import styled, { css } from '../../../../styled-components';
import { shadow } from '../../../theme/utils';
import BelowSliderCard from './BelowSliderCard';

const MainSliderCard = ({
  item,
  color,
  background,
  icon: Icon,
  children,
  onUpdate,
  onDelete,
  onPress,
}: ISliderCardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const position = useRef(new Animated.ValueXY());
  const translateXValue = useRef(0);
  const cardIsOpen = useRef({ value: false });
  const { t } = useTranslation();

  const { width } = Dimensions.get('window');

  const fontScale: number = useWindowDimensions().fontScale;

  const belowCards: {
    Icon: React.FC<SvgProps>;
    text: string;
    color: string;
    background: string;
    disabled?: boolean;
    onPress: () => void;
  }[] = [];

  if (true) {
    belowCards.push({
      Icon: CloseIcon,
      text: 'delete',
      color: Blue,
      background: LightBlue,
      disabled: false,
      onPress: () => {
        onDelete();
        cardIsOpen.current.value = false;
        Animated.timing(position.current, {
          toValue: 0,
          useNativeDriver: false,
          easing: Easing.in(Easing.ease),
          duration: 150,
        }).start();
      },
    });
  }
  if (true) {
    belowCards.push({
      Icon: EditIcon,
      text: 'update',
      color: Purple,
      background: LightPurple,
      onPress: () => {
        onUpdate();
        cardIsOpen.current.value = false;
        Animated.timing(position.current, {
          toValue: 0,
          useNativeDriver: false,
          easing: Easing.in(Easing.ease),
          duration: 150,
        }).start();
      },
    });
  }

  const isLtr = i18n.dir() === 'ltr';

  const openCardX = isLtr
    ? -(width / 4) * belowCards.length
    : (width / 4) * belowCards.length;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) >= 10,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, gestureState) => {
        const dx = Math.abs(gestureState.dx);
        const dy = Math.abs(gestureState.dy);
        const positionX = gestureState.dx;

        if (dx < dy) {
          return;
        } else if (Math.abs(positionX) > Math.abs(openCardX)) {
          return;
        } else {
          if (isLtr ? positionX > 0 : positionX < 0) {
            if (positionX < (isLtr ? -1 * openCardX : openCardX)) {
              position.current.setValue({
                x: positionX + openCardX,
                y: 0,
              });
            }
          } else if (Math.abs(positionX) > Math.abs(openCardX)) {
            position.current.setValue({ x: openCardX, y: 0 });
            translateXValue.current = openCardX;
          } else if (Math.abs(positionX) < Math.abs(openCardX)) {
            position.current.setValue({ x: positionX, y: 0 });
            translateXValue.current = positionX;
          }
          if (
            (isLtr ? positionX < 0 : positionX > 0) &&
            cardIsOpen.current.value
          ) {
            position.current.setValue({
              x: openCardX,
              y: 0,
            });
          }
          if (translateXValue.current === 0) {
            position.current.setValue({
              x: 0,
              y: 0,
            });
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const cardIsOpenValue = cardIsOpen.current.value;
        const shouldClose = cardIsOpenValue
          ? gestureState.dx > Math.abs(openCardX / 2)
          : gestureState.dx > openCardX / 2;
        const shouldCloseToZero = isLtr ? 0 : openCardX;
        const shouldCloseToMax = isLtr ? openCardX : 0;
        const toValue = shouldClose ? shouldCloseToZero : shouldCloseToMax;

        translateXValue.current = toValue;

        Animated.timing(position.current, {
          toValue: { x: toValue, y: 0 },
          duration: 150,
          easing: Easing.in(Easing.ease),
          useNativeDriver: Platform.OS === 'web',
        }).start(() => {
          cardIsOpen.current.value = toValue !== 0;
        });
      },
    }),
  );

  return (
    <Root>
      <BelowContainer>
        {belowCards.map((card, i) => {
          return (
            <>
              <BelowSliderCard
                key={card.text + i}
                Icon={card.Icon}
                text={t('button.' + card.text)}
                color={card.color}
                background={card.background}
                width={'30%'}
                height={`${100 / belowCards.length}%`}
                onPress={card.onPress}
              />
            </>
          );
        })}
      </BelowContainer>

      <UpperContainer
        status={item?.status}
        background={background}
        style={[{ transform: [{ translateX: position.current.x }] }]}
        {...panResponder.current.panHandlers}
      >
        <Pressable onPress={onPress}>
          {/* <CategoryRow>
            <CategoryColumn>
              <CategoryRow>
                <TopRowContainer>
                  <TopRow>
                    <CategoryTextContainer fontScale={fontScale}>
                      <CategoryText numberOfLines={2}>
                        {item.displayName}
                        {item.displayName}
                      </CategoryText>

                      <TagContainer>
                        <CategoryText numberOfLines={2}>
                          {item.displayName}
                        </CategoryText>
                      </TagContainer>
                    </CategoryTextContainer>
                    <Spacer direction="horizontal" size="xxs" />
                    <CategoryText numberOfLines={2}>
                      {item.displayName}
                    </CategoryText>
                  </TopRow>
                </TopRowContainer>
              </CategoryRow>
            </CategoryColumn>
          </CategoryRow> */}
          {children}
        </Pressable>
      </UpperContainer>
    </Root>
  );
};

const Root = styled.View`
  overflow: hidden;
  border-radius: 16px;
`;

const UpperContainer = styled(Animated.View)<{
  background: string;
}>`
  padding: 16px 12px;
  border-radius: 16px;
  ${shadow({
    opacity: 0.15,
    offsetWidth: -3,
    offsetHeight: 0,
    radius: 16,
    elevation: '4',
  }) as {}};
  ${({ status, background }) =>
    status === 1 || status === 2
      ? `background-color: ${background};`
      : css`
          background-color: white;
          border: 1px solid ${Gray4};
        `};
`;

const BelowContainer = styled.Pressable`
  position: absolute;
  width: 100%;
  height: 100%;
  flex-direction: row-reverse;
  right: 0;
  border-radius: 16px;
  overflow: hidden;
`;

export default MainSliderCard;
