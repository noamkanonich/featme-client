// src/screens/InsightsScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { subDays, format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import styled from '../../../styled-components';
import useAuth from '../../lib/auth/useAuth';
import { HeadingL, HeadingM, TextM, TextS } from '../../theme/typography';
import { Gray1, Green } from '../../theme/colors';
import InsightsIcon from '../../../assets/icons/nav-bar/navigation-insights.svg';
import TrendUpIcon from '../../../assets/icons/trend-up.svg';
import CustomTopBar from '../../components/custom-top-bar/CustomTopBar';
import Spacer from '../../components/spacer/Spacer';
import FadeInView from '../../components/animations/FadeInView';

import {
  getNutritionRange,
  gramsToKcalDistribution,
} from '../../utils/insights/insights-utils';
import CaloriesBar from './CaloriesBar';
import MacroPie, { MacroKey } from './MacroPie';

/* ===== Colors ===== */
const C = {
  bg: '#F6F7FB',
  card: '#FFFFFF',
  border: '#EEF2F7',
  text: '#0F172A',
  textDim: '#64748B',
  emerald: '#10B981',
  emeraldSoft: '#ECFDF5',
  blue: '#3B82F6',
  blueSoft: '#EFF6FF',
  purple: '#A855F7',
  purpleSoft: '#F5F3FF',
  amber: '#F59E0B',
  amberSoft: '#FFFBEB',
};

type DailyPoint = { date: string; calories: number };

type Stats = {
  totalCalories: number;
  avgCalories: number;
  avgProtein: number;
  avgFat: number;
  avgCarbs: number;
  macroDistribution: Array<{ key: MacroKey; value: number }>; // kcal
  dailyData: DailyPoint[];
};

const StatCard = ({
  title,
  value,
  unit,
  colorBg,
  colorText,
}: {
  title: string;
  value: number | string;
  unit?: string;
  colorBg: string;
  colorText: string;
}) => (
  <StatCardWrap>
    <IconBubble style={{ backgroundColor: colorBg }}>
      <TrendUpIcon width={32} height={32} stroke={colorText} fill="none" />
    </IconBubble>
    <Spacer direction="horizontal" size="xs" />
    <StatTextWrap>
      <StatValue>
        {value}
        {unit ? <StatUnit>{` ${unit}`}</StatUnit> : null}
      </StatValue>
      <StatLabel>{title}</StatLabel>
    </StatTextWrap>
  </StatCardWrap>
);

const InsightsScreen = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [timeRange, setTimeRange] = useState<7 | 30>(7);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const end = new Date();
      const start = subDays(end, timeRange - 1);

      const range = await getNutritionRange(user.id, start, end);

      const dailyPoints: DailyPoint[] = range.daily.map(d => ({
        date: format(d.date, 'MMM d'),
        calories: d.calories || 0,
      }));

      const dist = gramsToKcalDistribution({
        protein: range.totalProtein,
        fat: range.totalFat,
        carbs: range.totalCarbs,
      });

      const macroDistribution = [
        {
          key: 'protein' as const,
          label: t('nutrition.protein'),
          value: dist.proteinKcal,
        },
        { key: 'fat' as const, label: t('nutrition.fat'), value: dist.fatKcal },
        {
          key: 'carbs' as const,
          label: t('nutrition.carbs'),
          value: dist.carbsKcal,
        },
      ].filter(m => m.value > 0);

      setStats({
        totalCalories: range.totalCalories,
        avgCalories: range.avgCalories,
        avgProtein: range.avgProtein,
        avgFat: range.avgFat,
        avgCarbs: range.avgCarbs,
        macroDistribution,
        dailyData: dailyPoints,
      });
    } catch (e) {
      console.error('Insights load failed', e);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [user, timeRange, t]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Root>
      <CustomTopBar />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <HeaderWrap>
          <InsightsIcon width={40} height={40} fill={Green} />
          <Spacer direction="vertical" size="xs" />
          <Title>{t('insights_screen.title')}</Title>
          <Subtitle>{t('insights_screen.subtitle')}</Subtitle>
        </HeaderWrap>
        <Spacer direction="vertical" size="xl" />

        {/* Range Toggle */}
        <ToggleWrap>
          {[7, 30].map(d => {
            const active = d === timeRange;
            return (
              <ToggleBtn
                key={d}
                active={active}
                onPress={() => setTimeRange(d as 7 | 30)}
              >
                <ToggleText active={active}>
                  {t(
                    `insights_screen.last_${d}_days`,
                    d === 7 ? 'Last 7 days' : 'Last 30 days',
                  )}
                </ToggleText>
              </ToggleBtn>
            );
          })}
        </ToggleWrap>
        <Spacer direction="vertical" size="xl" />

        {/* Content */}
        {loading || !stats ? (
          <SkeletonWrap>
            <SkeletonCard />
            <Spacer direction="vertical" size="xl" />
            <SkeletonTall />
            <Spacer direction="vertical" size="xl" />
            <SkeletonTall />
          </SkeletonWrap>
        ) : (
          <>
            {/* Average Intake */}
            <Card>
              <FadeInView delay={100}>
                <CardTitle>{t('insights_screen.average_intake')}</CardTitle>
              </FadeInView>
              <Spacer direction="vertical" size="m" />
              <Grid>
                <Row>
                  <View style={{ flex: 1 }}>
                    <FadeInView delay={200} direction="down">
                      <StatCard
                        title={t('insights_screen.calories')}
                        value={stats.avgCalories}
                        colorBg={C.emeraldSoft}
                        colorText={C.emerald}
                      />
                    </FadeInView>
                  </View>
                  <Spacer direction="horizontal" size="m" />
                  <View style={{ flex: 1 }}>
                    <StatCard
                      title={t('insights_screen.protein')}
                      value={stats.avgProtein}
                      unit="g"
                      colorBg={C.blueSoft}
                      colorText={C.blue}
                    />
                  </View>
                </Row>
                <Spacer direction="vertical" size="m" />
                <Row>
                  <View style={{ flex: 1 }}>
                    <StatCard
                      title={t('insights_screen.fat')}
                      value={stats.avgFat}
                      unit="g"
                      colorBg={C.purpleSoft}
                      colorText={C.purple}
                    />
                  </View>
                  <Spacer direction="horizontal" size="m" />
                  <View style={{ flex: 1 }}>
                    <StatCard
                      title={t('insights_screen.carbs')}
                      value={stats.avgCarbs}
                      unit="g"
                      colorBg={C.amberSoft}
                      colorText={C.amber}
                    />
                  </View>
                </Row>
              </Grid>
            </Card>
            <Spacer direction="vertical" size="xl" />

            {/* Macro Distribution (Pie) */}
            <Card>
              <CardTitle>{t('insights_screen.macro_distribution')}</CardTitle>
              <Spacer direction="vertical" size="m" />
              <MacroPie
                data={stats.macroDistribution}
                totalMainValue={stats.totalCalories}
              />
            </Card>
            <Spacer direction="vertical" size="xl" />

            {/* Calorie Trend (BarChart) */}
            <Card>
              <CardTitle>{t('insights_screen.calories_trend')}</CardTitle>
              <ChartContainer>
                <CaloriesBar points={stats.dailyData} />
              </ChartContainer>
            </Card>
          </>
        )}
      </ScrollView>
    </Root>
  );
};

/* ===== styled ===== */
const Root = styled.View`
  flex: 1;
  background-color: ${C.bg};
`;

const HeaderWrap = styled.View`
  align-items: center;
`;

const Title = styled.Text`
  ${HeadingM};
  font-weight: bold;
`;

const Subtitle = styled.Text`
  ${TextS};
  color: ${Gray1};
`;

const ToggleWrap = styled.View`
  flex-direction: row;
  background-color: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 999px;
  padding: 4px;
`;

const ToggleBtn = styled.Pressable<{ active: boolean }>`
  flex: 1;
  padding: 10px 16px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background-color: ${({ active }) => (active ? C.emerald : 'transparent')};
`;

const ToggleText = styled.Text<{ active: boolean }>`
  ${TextM};
  color: ${({ active }) => (active ? '#fff' : C.textDim)};
  font-weight: bold;
`;

const Card = styled.View`
  background-color: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 24px;
  padding: 16px;
`;

const CardTitle = styled.Text`
  ${HeadingM};
  color: ${C.text};
  font-weight: bold;
`;

const Grid = styled.View``;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StatCardWrap = styled.View`
  background-color: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 16px;
  padding: 20px 12px;
  flex-direction: row;
  align-items: center;
`;

const IconBubble = styled.View`
  width: 46px;
  height: 52px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
`;

const StatTextWrap = styled.View``;

const StatValue = styled.Text`
  ${HeadingL};
  line-height: 24px;
  font-weight: bold;
  color: ${C.text};
`;

const StatUnit = styled.Text`
  ${TextM};
  color: ${C.textDim};
`;

const StatLabel = styled.Text`
  ${TextM};
  color: ${C.textDim};
`;

const ChartContainer = styled.View`
  padding-vertical: 8px;
`;

/* Empty & skeletons */
const SkeletonWrap = styled.View``;

const SkeletonCard = styled.View`
  height: 96px;
  background-color: #e5e7eb;
  border-radius: 24px;
`;

const SkeletonTall = styled(SkeletonCard)`
  height: 220px;
`;

export default InsightsScreen;
