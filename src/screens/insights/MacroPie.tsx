// MacroPie.tsx
import React, { useMemo } from 'react';
import { PieChart } from 'react-native-gifted-charts';
import Svg, { Line, Text as SvgText } from 'react-native-svg';
import styled from 'styled-components/native';
import { HeadingM, TextL, TextM } from '../../theme/typography';
import { White } from '../../theme/colors';

export type MacroKey = 'protein' | 'fat' | 'carbs';
export type Slice = { key: MacroKey; label: string; value: number };

interface IMacroPie {
  data: Slice[];
  totalMainValue?: number; // if not provided, sum of data values is used
  radius?: number;
  innerRadius?: number;
  showLegend?: boolean;
  colors?: Partial<Record<MacroKey, string>>;
  // label options
  showOutsideLabels?: boolean;
  labelOffset?: number;
  labelFontSize?: number;
  labelFontWeight?: '400' | '500' | '600' | '700' | '800';
  labelColor?: string;
  labelFormatter?: (slice: Slice, frac: number, total: number) => string;
  leaderLineWidth?: number;
  leaderLineColor?: string;
}

const DEFAULT_COLORS: Record<MacroKey, string> = {
  protein: '#3B82F6',
  fat: '#A855F7',
  carbs: '#F59E0B',
};

const deg2rad = (deg: number) => (deg * Math.PI) / 180;
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const MacroPie = ({
  data,
  totalMainValue,
  radius = 90,
  innerRadius = 58,
  showLegend = true,
  colors = {},
  showOutsideLabels = true,
  labelOffset = 18,
  labelFontSize = 13,
  labelFontWeight = '600',
  labelColor = '#0f172a',
  labelFormatter,
  leaderLineWidth = 1,
  leaderLineColor,
}: IMacroPie) => {
  const palette = { ...DEFAULT_COLORS, ...colors };
  const startAngleRad = deg2rad(-90); // gifted-charts starts at 12 o’clock, clockwise

  const { pieData, slices, total } = useMemo(() => {
    const filtered = data.filter(d => Number.isFinite(d.value) && d.value > 0);
    const tot = filtered.reduce((s, d) => s + d.value, 0);
    if (tot <= 0) return { pieData: [], slices: [], total: 0 };

    let acc = startAngleRad;
    const mapped = filtered.map(d => {
      const frac = d.value / tot;
      const sweep = frac * Math.PI * 2; // clockwise
      const mid = acc + sweep / 2;
      const seg = { ...d, frac, mid };
      acc += sweep;
      return seg;
    });

    return {
      total: tot,
      slices: mapped,
      pieData: mapped.map(m => ({
        value: m.value,
        label: m.label,
        color: palette[m.key],
      })),
    };
  }, [data, palette, startAngleRad]);

  if (!pieData.length) return <EmptyText>No macro data</EmptyText>;

  // Fixed canvas so overlay aligns perfectly (no re-measure loops)
  const pad = labelOffset + 24;
  const size = 2 * radius + 2 * pad;
  const cx = size / 2;
  const cy = size / 2;

  const polar = (r: number, a: number) => ({
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a),
  });

  return (
    <Root>
      <Canvas style={{ width: size, height: size }}>
        <PieChart
          data={pieData}
          donut
          radius={radius}
          innerRadius={innerRadius}
          showText={false} // custom labels below
          isAnimated
          animationDuration={700}
          strokeWidth={2}
          strokeColor={White}
          centerLabelComponent={() => (
            <Center>
              <CenterValue>{totalMainValue}</CenterValue>
              <CenterText>kcal</CenterText>
            </Center>
          )}
          curvedStartEdges
          curvedEndEdges
        />

        {showOutsideLabels && (
          <Svg
            pointerEvents="none"
            width={size}
            height={size}
            style={{ position: 'absolute', left: 0, top: 0 }}
          >
            {slices.map((s, i) => {
              const arc = polar(radius, s.mid);
              const lab = polar(radius + labelOffset, s.mid);
              const isRight = Math.cos(s.mid) >= 0;
              const tickX = lab.x + (isRight ? 10 : -10);
              const tickY = lab.y;
              const tx = clamp(tickX + (isRight ? 2 : -2), 6, size - 6);
              const ty = clamp(tickY + 4, 10, size - 6);
              const txt =
                labelFormatter?.(
                  { key: s.key, value: s.value },
                  s.frac,
                  total,
                ) ?? `${Math.round(s.frac * 100)}%`;
              const lineColor = leaderLineColor ?? palette[s.key];

              return (
                <React.Fragment key={`${s.key}-${i}`}>
                  <Line
                    x1={arc.x}
                    y1={arc.y}
                    x2={lab.x}
                    y2={lab.y}
                    stroke={lineColor}
                    strokeWidth={leaderLineWidth}
                  />
                  <Line
                    x1={lab.x}
                    y1={lab.y}
                    x2={tickX}
                    y2={tickY}
                    stroke={lineColor}
                    strokeWidth={leaderLineWidth}
                  />
                  <SvgText
                    x={tx}
                    y={ty}
                    fontSize={labelFontSize}
                    fontWeight={labelFontWeight as any}
                    fill={labelColor}
                    textAnchor={isRight ? 'start' : 'end'}
                  >
                    {txt}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        )}
      </Canvas>

      {showLegend && (
        <Legend>
          {data
            .filter(d => d.value > 0)
            .map(d => (
              <LegendItem key={d.key}>
                <Dot style={{ backgroundColor: palette[d.key] }} />
                <LegendText>{d.label}</LegendText>
              </LegendItem>
            ))}
        </Legend>
      )}
    </Root>
  );
};

const Root = styled.View`
  align-items: center;
`;

const Canvas = styled.View`
  position: relative;
  align-items: center;
  justify-content: center;
`;

const Center = styled.View`
  align-items: center;
  justify-content: center;
`;

const CenterText = styled.Text`
  ${TextM};
`;
const CenterValue = styled.Text`
  ${HeadingM};
  font-weight: 800;
`;

const EmptyText = styled.Text`
  color: #64748b;
  font-size: 12px;
  text-align: center;
`;

const Legend = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 10px;
  justify-content: center;
`;

const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 6px;
`;

const Dot = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  margin-right: 6px;
`;

const LegendText = styled.Text`
  color: #64748b;
`;

export default MacroPie;
