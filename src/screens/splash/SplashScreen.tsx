// SplashScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import { HeadingL, HeadingXL, TextL } from '../../theme/typography';
import { White } from '../../theme/colors';

type Props = {
  onComplete?: () => void;
  /** How long to show the splash before fading out (ms) */
  stayMs?: number;
  /** Fade-out duration (ms) */
  fadeOutMs?: number;
  /** Optional custom logo to render inside the circle */
  logo?: React.ReactNode;
  /** App name & tagline text (optional) */
  appName?: string;
  tagline?: string;
};

const SplashScreen: React.FC<Props> = ({
  onComplete,
  stayMs = 2500,
  fadeOutMs = 400,
  logo,
  appName = 'FeatMe',
  tagline = 'AI-Powered Nutrition',
}) => {
  const [visible, setVisible] = useState(true);

  // master fade
  const rootOpacity = useRef(new Animated.Value(1)).current;

  // logo entrance
  const logoIn = useRef(new Animated.Value(0)).current;

  // pulse rings
  const ringA = useRef(new Animated.Value(0)).current;
  const ringB = useRef(new Animated.Value(0)).current;

  // floating logo
  const floatY = useRef(new Animated.Value(0)).current;

  // text fade/slide
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(30)).current;

  // loading dots
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // logo spring in
    Animated.spring(logoIn, {
      toValue: 1,
      stiffness: 260,
      damping: 20,
      mass: 1,
      useNativeDriver: true,
    }).start();

    // text fade/slide
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        delay: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(textY, {
        toValue: 0,
        duration: 600,
        delay: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // floating loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -10,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // pulse rings loop helper
    const startRingLoop = (val: Animated.Value, delay = 0) => {
      const run = () => {
        val.setValue(0);
        Animated.timing(val, {
          toValue: 1,
          duration: 2000,
          delay,
          easing: Easing.bezier(0.215, 0.61, 0.355, 1),
          useNativeDriver: true,
        }).start(() => run());
      };
      run();
    };
    startRingLoop(ringA, 0);
    startRingLoop(ringB, 500);

    // loading dots loop
    const loopDot = (v: Animated.Value, startDelay: number) => {
      const seq = Animated.sequence([
        Animated.timing(v, {
          toValue: 1,
          duration: 500,
          delay: startDelay,
          useNativeDriver: true,
        }),
        Animated.timing(v, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]);
      Animated.loop(seq).start();
    };
    loopDot(dot1, 0);
    loopDot(dot2, 200);
    loopDot(dot3, 400);

    // schedule fade-out
    const t = setTimeout(() => {
      Animated.timing(rootOpacity, {
        toValue: 0,
        duration: fadeOutMs,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
        onComplete?.();
      });
    }, stayMs);

    return () => clearTimeout(t);
  }, [
    fadeOutMs,
    onComplete,
    rootOpacity,
    stayMs,
    logoIn,
    textOpacity,
    textY,
    floatY,
    ringA,
    ringB,
    dot1,
    dot2,
    dot3,
  ]);

  const rotate = logoIn.interpolate({
    inputRange: [0, 1],
    outputRange: ['-180deg', '0deg'],
  });
  const scale = logoIn.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // ring transforms (0 -> 1)
  const ringStyle = (v: Animated.Value) => ({
    transform: [
      {
        scale: v.interpolate({
          inputRange: [0, 1],
          outputRange: [0.33, 2.4],
        }),
      },
    ],
    opacity: v.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
  });

  const dotStyle = (v: Animated.Value) => ({
    transform: [
      {
        scale: v.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        }),
      },
    ],
    opacity: v.interpolate({
      inputRange: [0, 1],
      outputRange: [0.7, 1],
    }),
  });

  if (!visible) return null;

  return (
    <Root
      as={Animated.createAnimatedComponent(LinearGradient)}
      colors={['#34D399', '#34D399', '#14B8A6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ opacity: rootOpacity }}
    >
      <Center>
        {/* Logo block */}
        <LogoWrap>
          {/* pulse rings */}
          <Ring as={Animated.View} style={ringStyle(ringA)} />
          <Ring as={Animated.View} style={ringStyle(ringB)} />

          {/* main logo */}
          <LogoCircle
            as={Animated.View}
            style={{
              transform: [{ translateY: floatY }, { rotate }, { scale }],
              ...(Platform.OS === 'android' ? { elevation: 10 } : {}),
            }}
          >
            {logo ?? <Emoji>✨</Emoji>}
          </LogoCircle>
        </LogoWrap>

        {/* App name & tagline */}
        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textY }],
            alignItems: 'center',
          }}
        >
          <AppName>{appName}</AppName>
          {!!tagline && <Tagline>{tagline}</Tagline>}
        </Animated.View>

        {/* Loading dots */}
        <DotsRow>
          <Dot as={Animated.View} style={dotStyle(dot1)} />
          <Dot as={Animated.View} style={dotStyle(dot2)} />
          <Dot as={Animated.View} style={dotStyle(dot3)} />
        </DotsRow>
      </Center>
    </Root>
  );
};

const Root = styled(LinearGradient)`
  position: absolute;
  inset: 0;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Center = styled.View`
  align-items: center;
  justify-content: center;
`;

const LogoWrap = styled.View`
  width: 112px;
  height: 112px;
  margin-bottom: 24px;
  align-items: center;
  justify-content: center;
`;

const Ring = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.2);
`;

const LogoCircle = styled.View`
  width: 96px;
  height: 96px;
  border-radius: 9999px;
  background: #ffffff;
  align-items: center;
  justify-content: center;

  /* iOS shadow */
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 16px;
  shadow-offset: 0px 8px;
`;

const Emoji = styled(Text)`
  font-size: 36px;
  color: #10b981;
`;

const AppName = styled(Text)`
  ${HeadingXL};
  font-weight: bold;
  color: ${White};
  letter-spacing: -0.5px;
`;

const Tagline = styled(Text)`
  ${TextL};
  margin-top: 4px;
  color: ${White};
  color: rgba(255, 255, 255, 0.92);
  font-weight: 500;
`;

const DotsRow = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 28px;
`;

const Dot = styled(View)`
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: #ffffff;
  margin: 0 5px;
`;

export default SplashScreen;
