import React, { useEffect, useRef } from 'react';
import { Animated, Platform } from 'react-native';
import styled from 'styled-components/native';
import { SvgProps } from 'react-native-svg';
import { TextL, TextS, TextSLight } from '../../theme/typography';
import Spacer from '../spacer/Spacer';
import CountUpNumber from '../animations/CountUpNumber';

type PaletteKey = 'emerald' | 'blue' | 'purple' | 'orange';

interface INutritionCard {
  title: string;
  current: number;
  goal: number;
  unit?: string;
  color?: PaletteKey;
  icon: React.FC<SvgProps>;
}

const PALETTE: Record<
  PaletteKey,
  { iconBg: string; iconBorder: string; iconColor: string; progress: string }
> = {
  emerald: {
    iconBg: '#ECFDF5',
    iconBorder: '#D1FAE5',
    iconColor: '#059669',
    progress: '#10B981',
  },
  blue: {
    iconBg: '#EFF6FF',
    iconBorder: '#DBEAFE',
    iconColor: '#2563EB',
    progress: '#3B82F6',
  },
  purple: {
    iconBg: '#F5F3FF',
    iconBorder: '#E9D5FF',
    iconColor: '#7C3AED',
    progress: '#8B5CF6',
  },
  orange: {
    iconBg: '#FFF7ED',
    iconBorder: '#FFEDD5',
    iconColor: '#EA580C',
    progress: '#F97316',
  },
};

const NutritionCard = ({
  title,
  current,
  goal,
  unit,
  color = 'emerald',
  icon: Icon,
}: INutritionCard) => {
  const theme = PALETTE[color];
  const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  // progress bar animation
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: pct,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [pct, widthAnim]);

  return (
    <Root>
      <Card
        style={{
          ...(Platform.OS === 'android' ? { elevation: 2 } : null),
        }}
      >
        <TopRow>
          <IconBox
            style={{
              backgroundColor: theme.iconBg,
              borderColor: theme.iconBorder,
            }}
          >
            <Icon width={28} height={28} fill={theme.iconColor} />
          </IconBox>

          <Right>
            <CurrentNumber
              value={current}
              duration={800}
              formatter={n => Math.round(n).toLocaleString()}
            />
            <Row>
              <GoalText>{unit}</GoalText>
              <GoalText>{goal}</GoalText>
              <GoalText>/</GoalText>
            </Row>
            {/* <GoalText>
              / {goal}s
              {unit ?? ''}
            </GoalText> */}
          </Right>
        </TopRow>

        <LabelRow>
          <Label>{title}</Label>
          <Percent>{Math.round(pct)}%</Percent>
        </LabelRow>

        <Track>
          <Progress
            style={{
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: theme.progress,
            }}
          />
        </Track>
      </Card>
    </Root>
  );
};

/* ---- styles ---- */
const Root = styled.View`
  flex: 1;
`;

const Card = styled.View`
  background-color: #ffffff;
  border-radius: 24px;
  padding: 20px;
  border-width: 1px;
  border-color: #f3f4f6;

  shadow-color: #000;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.06;
`;

const TopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const IconBox = styled.View`
  width: 45px;
  height: 45px;
  border-radius: 16px;
  border-width: 1px;
  align-items: center;
  justify-content: center;
`;

const Right = styled.View`
  align-items: flex-end;
`;

const CurrentNumber = styled(CountUpNumber)`
  ${TextL};
  font-size: 23px;
  font-weight: 800;
`;

const Current = styled.Text`
  ${TextL};
  font-size: 24px;
  font-weight: 800;
`;

const GoalText = styled.Text`
  ${TextSLight};
  font-size: 12px;
  color: #6b7280;
`;

const LabelRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Label = styled.Text`
  ${TextS};
  font-weight: 600;
  color: #374151;
`;

const Percent = styled.Text`
  ${TextS};
  font-weight: 700;
  color: #111827;
`;

const Track = styled.View`
  width: 100%;
  height: 10px;
  background-color: #f3f4f6;
  border-radius: 999px;
  overflow: hidden;
`;

const Progress = styled(Animated.View)`
  height: 100%;
  border-radius: 32px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export default NutritionCard;
