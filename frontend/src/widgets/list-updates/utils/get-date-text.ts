import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(weekday);

dayjs().weekday(1);

export const getDateText = (date: Date): string => {
  const now = dayjs();
  const inputDate = dayjs(date);

  if (now.isSame(inputDate, 'day') || now.isBefore(inputDate)) {
    return 'Сегодня';
  }

  if (now.subtract(1, 'day').isSame(inputDate, 'day')) {
    return 'Вчера';
  }

  if (now.isSame(inputDate, 'week')) {
    return 'На этой неделе';
  }

  if (now.isSame(inputDate, 'month')) {
    return 'В этом месяце';
  }

  if (now.subtract(1, 'month').isSame(inputDate, 'month')) {
    return 'В прошлом месяце';
  }

  if (now.isSame(inputDate, 'year')) {
    return 'В этом году';
  }

  if (now.subtract(1, 'year').isSame(inputDate, 'year')) {
    return 'В прошлом году';
  }

  return 'Давно';
};
