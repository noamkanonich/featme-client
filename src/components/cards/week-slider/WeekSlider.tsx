// src/screens/history/WeekRangeCard.tsx
import React from 'react';
import styled from 'styled-components/native';
import { Pressable, Animated, StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import CalendarIcon from '../../../../assets/icons/calendar.svg';
import ChevronLeftIcon from '../../../../assets/icons/chevron-left.svg';
import ChevronRightIcon from '../../../../assets/icons/chevron-right.svg';
import i18n from '../../../i18n';
import { Gray1, Green, White } from '../../../theme/colors';
import { TextM } from '../../../theme/typography';

interface IWeekSlider {
  start: Date;
  end: Date;
  onPrev: () => void; // שבוע קודם
  onNext: () => void; // שבוע הבא
  onCenterPress?: () => void; // חזרה לשבוע הנוכחי
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>; // תמיכה ב-Animated
  shadowEnabled?: boolean; // ברירת מחדל true
}

const WeekSlider = ({
  start,
  end,
  onPrev,
  onNext,
  onCenterPress,
  style,
  shadowEnabled = true,
}: IWeekSlider) => {
  const { t } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const ChevronIconPrev = isRtl ? ChevronRightIcon : ChevronLeftIcon;
  const ChevronIconNext = isRtl ? ChevronLeftIcon : ChevronRightIcon;

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

  const monthName = (mIdx: number) => t(`dates.months.${monthKeys[mIdx]}`);

  const formatRangeLabel = (s: Date, e: Date) => {
    const sMonth = monthName(s.getMonth());
    const eMonth = monthName(e.getMonth());
    const sDay = s.getDate();
    const eDay = e.getDate();
    const year = e.getFullYear();

    if (!isRtl) {
      if (
        s.getMonth() === e.getMonth() &&
        s.getFullYear() === e.getFullYear()
      ) {
        return `${sMonth} ${sDay} – ${eDay}, ${year}`;
      }
      return `${sMonth} ${sDay} – ${eMonth} ${eDay}, ${year}`;
    }
    const hebPart = (d: number, m: string) => `${d} ב${m}`;
    return `${hebPart(sDay, sMonth)} – ${hebPart(eDay, eMonth)} ${year}`;
  };

  return (
    <Card style={style} $shadow={shadowEnabled}>
      <Row>
        <IconBtn
          onPress={e => {
            e.stopPropagation?.();
            onPrev();
          }}
        >
          <ChevronIconPrev width={24} height={24} fill={Gray1} />
        </IconBtn>

        <CenterPress onPress={onCenterPress}>
          <CalendarIcon width={28} height={28} fill={Green} />
          <SpacerHorizontal />
          <DateLabel>{formatRangeLabel(start, end)}</DateLabel>
        </CenterPress>

        <IconBtn
          onPress={e => {
            e.stopPropagation?.();
            onNext();
          }}
        >
          <ChevronIconNext width={24} height={24} fill={Gray1} />
        </IconBtn>
      </Row>
    </Card>
  );
};

export default WeekSlider;

/* ==== styles ==== */
const Card = styled(Animated.View)<{ $shadow: boolean }>`
  width: 100%;
  padding: 20px 0px;
  background-color: ${White};
  border-radius: 32px;
  border-width: 0px;

  /* iOS shadow */
  shadow-color: ${Gray1};
  shadow-opacity: ${({ $shadow }) => ($shadow ? 0.1 : 0)};
  shadow-radius: 2px;
  shadow-offset: 0px 8px;

  /* Android */
  elevation: ${({ $shadow }) => ($shadow ? 3 : 0)};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const IconBtn = styled.Pressable`
  width: 35px;
  height: 35px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
`;

const CenterPress = styled(Pressable)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const SpacerHorizontal = styled.View`
  width: 8px;
`;

const DateLabel = styled.Text`
  ${TextM};
  font-size: 15px;
`;
