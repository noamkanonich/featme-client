// src/components/DaySlider.tsx
import React from 'react';
import styled from 'styled-components/native';
import { addDays, isToday } from 'date-fns';
import ChevronLeftIcon from '../../../assets/icons/chevron-left.svg';
import ChevronRightIcon from '../../../assets/icons/chevron-right.svg';
import { Dark } from '../../theme/colors';
import { TextL, TextM } from '../../theme/typography';
import i18n from '../../i18n';

interface IDaySlider {
  selectedDate: Date;
  onDateChange: (d: Date) => void;
}

const DaySlider = ({ selectedDate, onDateChange }: IDaySlider) => {
  const prev = () => onDateChange(addDays(selectedDate, -1));
  const next = () => onDateChange(addDays(selectedDate, 1));
  const goToday = () => onDateChange(new Date());
  const today = isToday(selectedDate);

  const isRtl = i18n.dir() === 'rtl';
  const ChevronIconPrev = isRtl ? ChevronRightIcon : ChevronLeftIcon;
  const ChevronIconNext = isRtl ? ChevronLeftIcon : ChevronRightIcon;

  // ---- מיפוי המפתחות שיש לך לימים/חודשים ----
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

  const dayKey = dayKeys[selectedDate.getDay()];
  const monthKey = monthKeys[selectedDate.getMonth()];
  const dayName = i18n.t(`dates.days.${dayKey}`);
  const monthName = i18n.t(`dates.months.${monthKey}`);
  const dayNum = selectedDate.getDate();
  const year = selectedDate.getFullYear();

  // תבניות ניתנות לתרגום לכל שפה
  const title = today
    ? i18n.t('day_slider.today')
    : i18n.t('dates.formats.title', { month: monthName, day: dayNum });

  const subtitle = i18n.t('dates.formats.subtitle', {
    weekday: dayName,
    year,
  });

  return (
    <Card>
      <Row>
        <IconBtn onPress={prev}>
          <ChevronIconPrev width={24} height={24} fill={Dark} />
        </IconBtn>

        <Center>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </Center>

        <IconBtn onPress={next}>
          <ChevronIconNext width={24} height={24} fill={Dark} />
        </IconBtn>
      </Row>

      {!today && (
        <OutlineBtn onPress={goToday}>
          <OutlineText>{i18n.t('day_slider.go_to_today')}</OutlineText>
        </OutlineBtn>
      )}
    </Card>
  );
};

export default DaySlider;

/* ===== styles ===== */
const Card = styled.View`
  min-height: 100px;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 24px;
  padding: 12px;
  margin-bottom: 16px;
  border-width: 1px;
  border-color: #f3f4f6; /* gray-100 */
  shadow-color: #000;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  elevation: 2;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Center = styled.View`
  flex: 1;
  align-items: center;
`;

const IconBtn = styled.Pressable`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  ${TextL};
  font-size: 20px;
  font-weight: bold;
`;

const Subtitle = styled.Text`
  ${TextM};
  font-size: 14px;
  color: #6b7280;
`;

const OutlineBtn = styled.Pressable`
  align-self: center;
  margin-top: 8px;
  border-width: 1px;
  border-color: #a7f3d0; /* emerald-200 */
  padding: 6px 12px;
  border-radius: 999px;
`;

const OutlineText = styled.Text`
  color: #059669; /* emerald-600 */
  font-size: 14px;
  font-weight: 600;
`;
