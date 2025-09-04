// FadeInView.tsx
import React, { useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { Animated, Easing, ViewProps } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import styled from '../../../styled-components';

type Direction = 'left' | 'right' | 'up' | 'down';
type ChildFn = (finished: boolean) => ReactNode;

type Props = ViewProps & {
  direction?: Direction;
  distance?: number; // ברירת מחדל קטנה יותר כדי לא להיחתך
  duration?: number;
  delay?: number;
  appearOnFocus?: boolean; // כש-true ירוץ בכל פעם שהמסך נכנס לפוקוס
  animateKey?: string | number;
  onAnimationEnd?: () => void;
  children?: ReactNode | ChildFn;
  /** חותך את הצל עד סיום האנימציה (ברירת מחדל: true) */
  clipShadowUntilDone?: boolean;
};

const FadeInView = ({
  direction = 'left',
  distance = 16,
  duration = 350,
  delay = 0,
  appearOnFocus = true,
  animateKey,
  onAnimationEnd,
  style,
  children,
  clipShadowUntilDone = true,
  ...rest
}: Props) => {
  const isFocused = useIsFocused();

  const startOffset = useMemo(() => {
    switch (direction) {
      case 'left':
        return -distance;
      case 'right':
        return distance;
      case 'up':
        return distance;
      case 'down':
        return -distance;
      default:
        return 0;
    }
  }, [direction, distance]);

  const isHorizontal = direction === 'left' || direction === 'right';

  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(startOffset)).current;

  const [finished, setFinished] = useState(false);

  const run = () => {
    setFinished(false);
    opacity.stopAnimation();
    translate.stopAnimation();

    opacity.setValue(0);
    translate.setValue(startOffset);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true, // opacity + transform = OK
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished: done }) => {
      setFinished(true);
      if (done) onAnimationEnd?.();
    });
  };

  // אפקט יחיד שמחליט אם להריץ לפי appearOnFocus והפוקוס בפועל
  useEffect(() => {
    const shouldRun = appearOnFocus ? isFocused : true;
    if (shouldRun) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isFocused,
    appearOnFocus,
    animateKey,
    direction,
    distance,
    duration,
    delay,
  ]);

  const content =
    typeof children === 'function' ? (children as ChildFn)(finished) : children;

  return (
    <ClipWrap
      // חותך את ה-shadow עד שהאנימציה מסתיימת
      style={{
        overflow:
          clipShadowUntilDone && !finished ? ('hidden' as any) : 'visible',
      }}
    >
      <Root
        // iOS: מסייע לחיבור opacity + shadows חלק
        needsOffscreenAlphaCompositing
        style={[
          {
            opacity,
            transform: isHorizontal
              ? [{ translateX: translate }]
              : [{ translateY: translate }],
          },
          style,
        ]}
        {...rest}
      >
        {content}
      </Root>
    </ClipWrap>
  );
};

const ClipWrap = styled.View`
  width: 100%;
`;

const Root = styled(Animated.View)`
  width: 100%;
`;

export default FadeInView;
