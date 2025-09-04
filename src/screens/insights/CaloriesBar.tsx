import React, { useState } from 'react';
import { BarChart } from 'react-native-gifted-charts';
import styled from '../../../styled-components';

const C = {
  emerald: '#10B981',
  text: '#0F172A',
  textDim: '#64748B',
  white: '#FFFFFF',
  border: '#EEF2F7',
};

type DailyPoint = { date: string; calories: number };

const CaloriesBar = ({ points }: { points: DailyPoint[] }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const barData = points.map(p => ({
    value: p.calories,
    label: p.date,
    frontColor: C.emerald,
  }));

  if (barData.length === 0) {
    return <EmptyHintText>No trend data</EmptyHintText>;
  }

  return (
    <BarChart
      data={barData}
      barWidth={20}
      spacing={12}
      initialSpacing={14}
      xAxisThickness={0}
      yAxisThickness={0}
      hideRules
      noOfSections={4}
      isAnimated
      xAxisLabelTextStyle={{ color: C.textDim, fontSize: 9 }}
      yAxisTextStyle={{ color: C.textDim, fontSize: 12 }}
      barBorderRadius={6}
      // --- Tooltip config ---
      onPress={(_, index) =>
        setActiveIndex(prev => (prev === index ? null : index))
      }
      selectedIndex={activeIndex ?? -1}
      showTooltip={activeIndex !== null}
      renderTooltip={item => (
        <TooltipWrap>
          <TooltipText>{`${Math.round(item.value)} kcal`}</TooltipText>
        </TooltipWrap>
      )}
      // optional: brings the selected bar forward for clarity
      selectedBarStyle={{ opacity: 1 }}
      // optional: dim others slightly
      frontColorOpacity={activeIndex === null ? 1 : 0.5}
    />
  );
};

export default CaloriesBar;

// --- tiny helpers (add near your styles) ---
const EmptyHintText = styled.Text`
  font-size: 12px;
  color: ${C.textDim};
  text-align: center;
`;

const TooltipWrap = styled.View`
  padding: 6px 10px;
  background-color: ${C.white};
  border: 1px solid ${C.border};
  border-radius: 10px;
`;

const TooltipText = styled.Text`
  font-size: 12px;
  color: ${C.text};
  font-weight: 700;
`;
