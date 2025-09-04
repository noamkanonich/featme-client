// components/SkeletonScreen.tsx
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';
import Spacer from '../../components/spacer/Spacer';
import { Gray4 } from '../../theme/colors';

const usePulse = (min = 0.6, max = 1, duration = 1200) => {
  const opacity = useRef(new Animated.Value(min)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: max,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: min,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity, min, max, duration]);
  return opacity;
};

const SkeletonScreen: React.FC = () => {
  const opacity = usePulse();

  return (
    <Wrap>
      <Large style={{ opacity }} />
      <Spacer direction="vertical" size="xl" />
      <Grid>
        {[1, 2, 3, 4].map(i => (
          <Tile key={i} style={{ opacity }} />
        ))}
      </Grid>
    </Wrap>
  );
};

export default SkeletonScreen;

/* ---- styles ---- */
const Wrap = styled.View`
  padding: 8px; /* p-4 */
`;

const Large = styled(Animated.View)`
  width: 100%;
  height: 120px; /* h-20 */
  background-color: ${Gray4}; /* gray-100 */
  border-radius: 24px; /* rounded-3xl */
  margin-bottom: 24px; /* space-y-6 gap */
`;

const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between; /* grid-cols-2 gap */
`;

const Tile = styled(Animated.View)`
  width: 48%;
  height: 128px; /* h-32 */
  background-color: ${Gray4}; /* gray-100 */
  border-radius: 24px; /* rounded-3xl */
  margin-bottom: 16px; /* gap-4 */
`;
