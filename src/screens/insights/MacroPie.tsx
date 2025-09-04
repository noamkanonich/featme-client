import React, { useMemo } from 'react';
import { PieChart } from 'react-native-gifted-charts';
import styled from '../../../styled-components';

export type MacroKey = 'protein' | 'fat' | 'carbs';

type Slice = {
  key: MacroKey; // 'protein' | 'fat' | 'carbs'
  value: number; // kcal (already multiplied: protein*4, fat*9, carbs*4)
};

type Props = {
  data: Slice[];
  radius?: number;
  innerRadius?: number;
  centerLabel?: string;
  // optional override colors
  colors?: Partial<Record<MacroKey, string>>;
};

const DEFAULT_COLORS: Record<MacroKey, string> = {
  protein: '#3B82F6', // blue
  fat: '#A855F7', // purple
  carbs: '#F59E0B', // amber
};

const MacroPie: React.FC<Props> = ({
  data,
  radius = 85,
  innerRadius = 55,
  centerLabel = 'Macros',
  colors = {},
}) => {
  const palette = { ...DEFAULT_COLORS, ...colors };

  const pieData = useMemo(() => {
    const filtered = data.filter(d => d.value > 0);
    const total = filtered.reduce((s, d) => s + d.value, 0) || 1;

    return filtered.map(d => {
      const pct = Math.round((d.value / total) * 100);
      return {
        value: d.value,
        color: palette[d.key],
        text: `${pct}%`, // value text on each slice
      };
    });
  }, [data, palette]);

  if (pieData.length === 0) {
    return <EmptyHintText>No macro data</EmptyHintText>;
  }

  return (
    <PieWrap>
      <PieChart
        data={pieData}
        donut
        radius={radius}
        innerRadius={innerRadius}
        showText
        textSize={12}
        textBackgroundColor="transparent"
        focusOnPress
        isAnimated
        animationDuration={800}
        strokeColor="#FFFFFF"
        strokeWidth={2}
        centerLabelComponent={() => (
          <CenterWrap>
            <CenterText>{centerLabel}</CenterText>
          </CenterWrap>
        )}
      />
      <LegendRow>
        {data
          .filter(d => d.value > 0)
          .map(d => (
            <LegendItem key={d.key}>
              <Dot style={{ backgroundColor: palette[d.key] }} />
              <LegendText>{d.key}</LegendText>
            </LegendItem>
          ))}
      </LegendRow>
    </PieWrap>
  );
};

export default MacroPie;

/* ============ styles ============ */

const PieWrap = styled.View`
  align-items: center;
  justify-content: center;
  padding: 8px 0;
`;

const CenterWrap = styled.View`
  align-items: center;
  justify-content: center;
`;

const CenterText = styled.Text`
  font-size: 12px;
  color: #64748b; /* textDim */
`;

const LegendRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
`;

const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const Dot = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 10px;
`;

const LegendText = styled.Text`
  font-size: 13px;
  color: #64748b; /* textDim */
`;

const EmptyHintText = styled.Text`
  font-size: 12px;
  color: #64748b; /* textDim */
  text-align: center;
`;
