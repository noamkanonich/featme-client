import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Platform } from 'react-native';
import { addDays, startOfWeek, endOfWeek } from 'date-fns';
import {
  Blue,
  Dark,
  Gray1,
  Gray7,
  Green,
  Purple,
  White,
} from '../../theme/colors';
import styled from '../../../styled-components';
import { HeadingM, TextL, TextS } from '../../theme/typography';
import Spacer from '../../components/spacer/Spacer';
import { useTranslation } from 'react-i18next';
import TrendUpIcon from '../../../assets/icons/trendup.svg';
import { ScrollView } from 'moti';
import DailyBreakdownCard, {
  DailyData,
} from '../../components/cards/DailyBreakdownCard';
import { useIsFocused } from '@react-navigation/native';
import WeekSlider from '../../components/cards/week-slider/WeekSlider';
import FadeInView from '../../components/animations/FadeInView';
import CustomTopBar from '../../components/custom-top-bar/CustomTopBar';
import useAuth from '../../lib/auth/useAuth';
import useUserData from '../../lib/user-data/useUserData';
import {
  computeWeekStats,
  loadWeekData,
} from '../../utils/history/history-utils';
import CountUpNumber from '../../components/animations/CountUpNumber';
import HistoryIcon from '../../../assets/icons/nav-bar/navigation-history.svg';

const DAILY_GOAL = 2000; // TODO: replace with user's goal if you have it

const HistoryScreen = () => {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const { user } = useAuth();
  const { userGoals } = useUserData();
  const [isLoading, setIsLoading] = useState(false);

  // ---- Week range ----
  const today = new Date();
  const initialStart = useMemo(
    () => startOfWeek(today, { weekStartsOn: 0 }),
    [today],
  );
  const [rangeStart, setRangeStart] = useState<Date>(initialStart);
  const rangeEnd = useMemo(
    () => endOfWeek(rangeStart, { weekStartsOn: 0 }),
    [rangeStart],
  );

  const prevWeek = () => setRangeStart(addDays(rangeStart, -7));
  const nextWeek = () => setRangeStart(addDays(rangeStart, 7));
  const goThisWeek = () => setRangeStart(initialStart);

  // ---- Data ----
  const [weekData, setWeekData] = useState<DailyData[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      if (!user) {
        if (mounted) setWeekData([]);
        setIsLoading(false);

        return;
      }
      const data = await loadWeekData(
        user.id,
        rangeStart,
        rangeEnd,
        userGoals?.dailyCalories || DAILY_GOAL,
      );
      if (mounted) setWeekData(data);
      setIsLoading(false);
    })();
    return () => {
      mounted = false;
      setIsLoading(false);
    };
  }, [user, rangeStart, rangeEnd, userGoals]);

  const stats = useMemo(() => computeWeekStats(weekData), [weekData]);

  return (
    <Root>
      <CustomTopBar />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Container>
          <TitleContainer>
            <HistoryIcon width={40} height={40} fill={Green} />
            <Spacer direction="vertical" size="xs" />
            <Title>{t('history_screen.title')}</Title>
            <Subitle>{t('history_screen.subtitle')}</Subitle>
          </TitleContainer>

          <Spacer direction="vertical" size="xl" />

          <WeekSlider
            start={rangeStart}
            end={rangeEnd}
            onPrev={prevWeek}
            onNext={nextWeek}
            onCenterPress={goThisWeek}
          />

          <Spacer direction="vertical" size="xl" />

          <WeeklyStatsCard>
            <FadeInView direction="left" delay={400}>
              <TitleRow>
                <TrendUpIcon width={28} height={28} fill={Green} />
                <Spacer direction="horizontal" size="xs" />
                <CardLabel>{t('history_screen.this_week')}</CardLabel>
              </TitleRow>

              <Spacer direction="vertical" size="s" />

              <Row>
                <StatsContainer>
                  <CurrentNumber
                    value={stats.totalEntries}
                    color={Green}
                    duration={800}
                    formatter={n => Math.round(n).toLocaleString()}
                  />

                  <Spacer direction="vertical" size="xxs" />
                  <StatsLabel>{t('history_screen.total_entries')}</StatsLabel>
                </StatsContainer>

                <StatsContainer>
                  <CurrentNumber
                    value={stats.avgCalories}
                    color={Blue}
                    duration={500}
                    formatter={n => Math.round(n).toLocaleString()}
                  />
                  <Spacer direction="vertical" size="xxs" />
                  <StatsLabel>{t('history_screen.avg_calories')}</StatsLabel>
                </StatsContainer>

                <StatsContainer>
                  <CurrentNumber
                    value={stats.daysTracked}
                    color={Purple}
                    duration={800}
                    formatter={n => Math.round(n).toLocaleString()}
                  />
                  <Spacer direction="vertical" size="xxs" />
                  <StatsLabel>{t('history_screen.days_tracked')}</StatsLabel>
                </StatsContainer>
              </Row>
            </FadeInView>
          </WeeklyStatsCard>

          <Spacer direction="vertical" size="xxl-2" />
          {isLoading ? (
            <>
              <Spacer direction="vertical" size="xxl-2" />
              <ActivityIndicator size="large" color={Dark} />
            </>
          ) : (
            <>
              <DailyBreakdownContainer>
                <DailyBreakdownTitle>
                  {t('history_screen.daily_breakdown_title')}
                </DailyBreakdownTitle>
                <Spacer direction="vertical" size="s" />
                {weekData.map((d, i) => (
                  <FadeInView
                    key={d.date.toISOString().slice(0, 10)}
                    direction="up"
                    delay={i * 120}
                  >
                    <DailyBreakdownCard data={d} shadowEnabled={false} />
                  </FadeInView>
                ))}
              </DailyBreakdownContainer>
            </>
          )}
        </Container>
      </ScrollView>
    </Root>
  );
};

/* ===== styles ===== */
const Root = styled.View`
  flex: 1;
  background-color: ${Gray7};
`;

const Container = styled.View`
  justify-content: center;
  padding: 20px;
`;

const TitleContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  ${HeadingM};
  font-weight: bold;
`;

const Subitle = styled.Text`
  ${TextS};
  color: ${Gray1};
`;

const WeeklyStatsCard = styled(Animated.View)`
  width: 100%;
  padding: 24px;
  background-color: ${White};
  border-radius: 32px;
  shadow-color: ${Gray1};
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  shadow-offset: 0px 8px;
  elevation: 3;
`;

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const CardLabel = styled.Text`
  ${TextL};
  font-weight: bold;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StatsContainer = styled.View`
  flex: 1;
  align-items: center;
`;

const StatsValue = styled.Text<{ color: string }>`
  ${HeadingM};
  line-height: normal;
  font-weight: bold;
  color: ${({ color }) => color};
`;

const StatsLabel = styled.Text`
  ${TextS};
  color: ${Gray1};
  font-size: 11px;
`;

const DailyBreakdownContainer = styled(Animated.View)`
  flex: 1;
`;

const DailyBreakdownTitle = styled.Text`
  ${TextL};
  font-weight: bold;
`;

const CurrentNumber = styled(CountUpNumber)<{ color: string }>`
  ${TextL};
  font-size: 24px;
  color: ${({ color }: { color: string }) => color};
  font-weight: bold;
`;

export default HistoryScreen;
