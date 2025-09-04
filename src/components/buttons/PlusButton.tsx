import React, { useEffect, useRef } from 'react';
import { Pressable, Animated, Easing } from 'react-native';
import styled from '../../../styled-components';
import PlusIcon from '../../../assets/icons/plus.svg';
import { White } from '../../theme/colors';
import LinearGradient from 'react-native-linear-gradient';

const BOUNCE = 10; // px to move up
const SPEED = 220; // ms for each up/down
const PAUSE = 2200; // ms pause between cycles

interface IPlusButton {
  onPress: () => void;
}

const PlusButton = ({ onPress }: IPlusButton) => {
  const ty = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const up = Animated.timing(ty, {
      toValue: -BOUNCE,
      duration: SPEED,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });
    const down = Animated.timing(ty, {
      toValue: 0,
      duration: SPEED,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    });

    const cycle = Animated.sequence([
      up,
      down,
      up,
      down,
      Animated.delay(PAUSE),
    ]);
    const loop = Animated.loop(cycle);
    loop.start();
    return () => loop.stop();
  }, [ty]);

  return (
    <Floating style={{ transform: [{ translateY: ty }] }}>
      <Pressable onPress={onPress}>
        <ButtonContainer>
          <PlusIcon width={36} height={36} fill={White} stroke={White} />
        </ButtonContainer>
      </Pressable>
    </Floating>
  );
};

export default PlusButton;

/* -------- styles -------- */
const Floating = styled(Animated.View)`
  position: absolute;
  right: 20px;
  bottom: 85px;
`;

const ButtonContainer = styled(LinearGradient).attrs({
  colors: ['#1eb47d', '#60be9f'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
})`
  width: 64px;
  height: 64px;
  border-radius: 36px;
  align-items: center;
  justify-content: center;

  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;
