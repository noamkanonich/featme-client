import {
  addDays,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

export const stripTime = (d: Date) => {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

export const buildMatrix = (monthCursor: Date): Date[][] => {
  // from startOfWeek of first day to endOfWeek of last day
  const start = startOfWeek(startOfMonth(monthCursor), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(monthCursor), { weekStartsOn: 0 });

  const days: Date[] = [];
  for (let dt = start; dt <= end; dt = addDays(dt, 1)) {
    days.push(stripTime(dt));
  }

  // chunk into weeks of 7
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
};
