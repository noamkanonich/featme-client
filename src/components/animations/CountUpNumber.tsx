import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  TextProps,
  StyleProp,
  TextStyle,
} from 'react-native';

type CountUpNumberProps = {
  /** הערך הסופי להגיע אליו */
  value: number;
  /** משך אנימציה במילישניות */
  duration?: number;
  /** פונקציית easing */
  easing?: (t: number) => number;
  /** פורמט תצוגה (ברירת מחדל: עיגול שלם) */
  formatter?: (n: number) => string;
  /** ערך התחלה בהרכבה ראשונית */
  from?: number;
  /** האם להתחיל מהערך האחרון באנימציה (ברירת מחדל: true) */
  animateFromPrev?: boolean;
  /** סגנון טקסט */
  style?: StyleProp<TextStyle>;
  /** יופעל בסיום האנימציה */
  onEnd?: () => void;
} & Omit<TextProps, 'style'>;

const CountUpNumber: React.FC<CountUpNumberProps> = ({
  value,
  duration = 800,
  easing = Easing.out(Easing.cubic),
  formatter,
  from = 0,
  animateFromPrev = true,
  style,
  onEnd,
  ...textProps
}) => {
  const anim = useRef(new Animated.Value(from)).current;
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    const id = anim.addListener(({ value }) => setDisplay(value));

    const start = () => {
      Animated.timing(anim, {
        toValue: value,
        duration,
        easing,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished && onEnd) onEnd();
      });
    };

    if (animateFromPrev) {
      anim.stopAnimation((v?: number) => {
        anim.setValue(typeof v === 'number' ? v : from);
        start();
      });
    } else {
      anim.setValue(from);
      start();
    }

    return () => {
      anim.removeListener(id);
      anim.stopAnimation();
    };
  }, [value, duration, easing, animateFromPrev, from, onEnd, anim]);

  const text = formatter ? formatter(display) : Math.round(display).toString();

  return (
    <Animated.Text {...textProps} style={style}>
      {text}
    </Animated.Text>
  );
};

export default CountUpNumber;
