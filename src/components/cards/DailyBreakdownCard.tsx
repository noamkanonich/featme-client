import React from 'react';
import styled from 'styled-components/native';
import ProgressBar from '../progress-bar/ProgressBar';
import FlameIcon from '../../../assets/icons/calories.svg';
import { SunsetOrange } from '../../theme/colors';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

export type DailyData = {
  date: Date;
  calories: number;
  entries: number;
  caloriesGoal?: number; // if provided, we compute percent from this
  percent?: number; // or pass percent directly (0..100)
};

interface IDailyBreakdownCard {
  data: DailyData;
  shadowEnabled?: boolean; // NEW: gate shadow/elevation
}

const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
const monthKeys = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'june',
  'july',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
] as const;

const DailyBreakdownCard = ({
  data,
  shadowEnabled = true,
}: IDailyBreakdownCard) => {
  const { t } = useTranslation();

  const isRtl = i18n.dir() === 'rtl';

  const d = data.date.getDate();
  const dayIdx = data.date.getDay(); // 0..6 (Sun..Sat)
  const mIdx = data.date.getMonth(); // 0..11
  const y = data.date.getFullYear();

  const weekday = t(`dates.days.${dayKeys[dayIdx]}`);
  const monthName = t(`dates.months.${monthKeys[mIdx]}`);

  // LTR: "August 14, 2025"
  // RTL: "14 באוגוסט 2025"
  const dateLine = isRtl
    ? `${d} ב${monthName} ${y}`
    : `${monthName} ${d}, ${y}`;

  const percent =
    typeof data.percent === 'number'
      ? Math.max(0, Math.min(100, data.percent))
      : data.caloriesGoal && data.caloriesGoal > 0
      ? Math.max(0, Math.min(100, (data.calories / data.caloriesGoal) * 100))
      : 0;

  return (
    <Card $shadow={shadowEnabled}>
      <TopRow>
        <LeftBox>
          <DayBadge>
            <DayBadgeText>{d}</DayBadgeText>
          </DayBadge>

          <LeftText>
            <Weekday>{weekday}</Weekday>
            <DateText>{dateLine}</DateText>
          </LeftText>
        </LeftBox>

        <RightBox>
          <CalRow>
            <FlameIcon width={18} height={18} fill={SunsetOrange} />
            <CalValue>{data.calories}</CalValue>
          </CalRow>
          <EntriesText>
            {data.entries} {t('history_screen.entries')}
          </EntriesText>
        </RightBox>
      </TopRow>

      <SectionTitle>{t('history_screen.calories_progress')}</SectionTitle>
      <ProgressRow>
        <ProgressBar value={percent} maxValue={100} />
        <PercentText>{Math.round(percent)}%</PercentText>
      </ProgressRow>

      {data.entries === 0 && (
        <EmptyText>{t('history_screen.no_entries')}</EmptyText>
      )}
    </Card>
  );
};

export default DailyBreakdownCard;

/* ---------------- styles ---------------- */
const Card = styled.View<{ $shadow: boolean }>`
  background: #ffffff;
  border-radius: 20px;
  padding: 16px;
  border-width: 1px;
  border-color: #eef2f7;
  margin-bottom: 16px;

  /* iOS */
  shadow-color: #000;
  shadow-opacity: ${({ $shadow }) => ($shadow ? 0.06 : 0)};
  shadow-radius: 10px;
  shadow-offset: 0px 4px;

  /* Android */
  elevation: ${({ $shadow }) => ($shadow ? 2 : 0)};
`;

const TopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const LeftBox = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const DayBadge = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f3f4f6;
  align-items: center;
  justify-content: center;
`;

const DayBadgeText = styled.Text`
  font-size: 18px;
  font-weight: 800;
  color: #111827;
`;

const LeftText = styled.View``;

const Weekday = styled.Text`
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
`;

const DateText = styled.Text`
  margin-top: 2px;
  font-size: 13px;
  color: #6b7280;
`;

const RightBox = styled.View`
  align-items: flex-end;
`;

const CalRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const CalValue = styled.Text`
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
`;

const EntriesText = styled.Text`
  margin-top: 2px;
  font-size: 13px;
  color: #6b7280;
`;

const SectionTitle = styled.Text`
  margin-top: 14px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

const ProgressRow = styled.View`
  margin-top: 8px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const PercentText = styled.Text`
  margin-left: auto;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
`;

const EmptyText = styled.Text`
  margin-top: 10px;
  font-size: 13px;
  color: #9ca3af;
  text-align: center;
`;
