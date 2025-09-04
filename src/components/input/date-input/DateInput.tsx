// components/DateInput.tsx
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, FlatList, Platform } from 'react-native';
import styled from 'styled-components/native';
import {
  format,
  startOfMonth,
  addMonths,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { buildMatrix, stripTime } from './utils';

/** Replace with your SVG if you have one */
const CalendarGlyph = () => (
  <Glyph>
    <Bar />
  </Glyph>
);

type Props = {
  label?: string;
  value: Date;
  onChange: (d: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  /** e.g. 'MM/dd/yyyy' */
  displayFormat?: string;
};

const DateInput: React.FC<Props> = ({
  label = 'Birth Date',
  value,
  onChange,
  minDate,
  maxDate,
  displayFormat = 'MM/dd/yyyy',
}) => {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState<Date>(startOfMonth(value));

  const weeks = useMemo(() => buildMatrix(cursor), [cursor]);

  const handlePick = (day: Date) => {
    // clamp (optional)
    if (minDate && day < stripTime(minDate)) return;
    if (maxDate && day > stripTime(maxDate)) return;
    onChange(day);
    setCursor(startOfMonth(day));
    setOpen(false);
  };

  return (
    <>
      {label ? <Label>{label}</Label> : null}

      <Field onPress={() => setOpen(true)}>
        <FieldText>{format(value, displayFormat)}</FieldText>
        <CalendarGlyph />
      </Field>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Overlay onPress={() => setOpen(false)} />
        <Sheet>
          <HeaderRow>
            <Nav onPress={() => setCursor(addMonths(cursor, -1))}>
              <NavText>‹</NavText>
            </Nav>
            <HeaderTitle>{format(cursor, 'MMMM yyyy')}</HeaderTitle>
            <Nav onPress={() => setCursor(addMonths(cursor, 1))}>
              <NavText>›</NavText>
            </Nav>
          </HeaderRow>

          <WeekdaysRow>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <Weekday key={d}>{d}</Weekday>
            ))}
          </WeekdaysRow>

          {/* Weeks grid */}
          <FlatList
            data={weeks}
            keyExtractor={(_, i) => `w-${i}`}
            renderItem={({ item: days }) => (
              <DaysRow>
                {days.map((d, i) => {
                  const out = !isSameMonth(d, cursor);
                  const selected = isSameDay(d, value);
                  const disabled =
                    (minDate && d < stripTime(minDate)) ||
                    (maxDate && d > stripTime(maxDate));
                  return (
                    <DayCell
                      key={i}
                      $selected={selected}
                      $out={out}
                      $disabled={!!disabled}
                      onPress={() => !disabled && handlePick(d)}
                    >
                      <DayText
                        $selected={selected}
                        $out={out}
                        $disabled={!!disabled}
                      >
                        {format(d, 'd')}
                      </DayText>
                    </DayCell>
                  );
                })}
              </DaysRow>
            )}
          />

          <Footer>
            <FooterBtn onPress={() => setOpen(false)}>
              <FooterTxt>Cancel</FooterTxt>
            </FooterBtn>
            <FooterBtn
              onPress={() => {
                onChange(stripTime(new Date()));
                setCursor(startOfMonth(new Date()));
                setOpen(false);
              }}
            >
              <FooterTxt>Today</FooterTxt>
            </FooterBtn>
          </Footer>
        </Sheet>
      </Modal>
    </>
  );
};

const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #374151; /* slate-700 */
  margin-bottom: 8px;
  text-align: center;
`;

const Field = styled.Pressable`
  height: 48px;
  border-radius: 24px;
  background: #ffffff;
  border-width: 1px;
  border-color: #e5e7eb; /* gray-200 */
  padding: 0 14px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  /* subtle shadow like iOS */
  shadow-color: #000;
  shadow-opacity: 0.06;
  shadow-radius: 6px;
  shadow-offset: 0px 3px;
  ${Platform.OS === 'android' ? 'elevation: 2;' : ''}
`;

const FieldText = styled.Text`
  font-size: 18px;
  color: #111827;
`;

const Overlay = styled.Pressable`
  flex: 1;
  background: rgba(0, 0, 0, 0.15);
`;

const Sheet = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 16px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;

  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 12px;
  shadow-offset: 0px -4px;
  ${Platform.OS === 'android' ? 'elevation: 12;' : ''}
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;

const Nav = styled.Pressable`
  padding: 6px 10px;
  border-radius: 8px;
  background: #f3f4f6;
`;
const NavText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`;

const WeekdaysRow = styled.View`
  margin-top: 12px;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 2px;
`;

const Weekday = styled.Text`
  width: 40px;
  text-align: center;
  font-size: 12px;
  color: #6b7280; /* gray-500 */
`;

const DaysRow = styled.View`
  margin-top: 6px;
  flex-direction: row;
  justify-content: space-between;
`;

const DayCell = styled(Pressable)<{
  $selected?: boolean;
  $out?: boolean;
  $disabled?: boolean;
}>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;

  background: ${({ $selected }) => ($selected ? '#e6fff4' : 'transparent')};
  border-width: ${({ $selected }) => ($selected ? 2 : 0)}px;
  border-color: ${({ $selected }) => ($selected ? '#10b981' : 'transparent')};
  opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};
`;

const DayText = styled.Text<{
  $selected?: boolean;
  $out?: boolean;
  $disabled?: boolean;
}>`
  font-size: 14px;
  font-weight: ${({ $selected }) => ($selected ? 800 : 600)};
  color: ${({ $selected, $out }) =>
    $selected ? '#047857' : $out ? '#9ca3af' : '#111827'};
`;

const Footer = styled.View`
  margin-top: 10px;
  padding-top: 10px;
  border-top-width: 1px;
  border-top-color: #f3f4f6;
  flex-direction: row;
  justify-content: flex-end;
  gap: 12px;
`;
const FooterBtn = styled.Pressable`
  padding: 10px 14px;
  border-radius: 10px;
  background: #f3f4f6;
`;
const FooterTxt = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
`;

const Glyph = styled.View`
  width: 22px;
  height: 20px;
  border-radius: 4px;
  border-width: 2px;
  border-color: #111827;
  align-items: center;
  justify-content: flex-start;
`;
const Bar = styled.View`
  width: 100%;
  height: 4px;
  background: #111827;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

export default DateInput;
