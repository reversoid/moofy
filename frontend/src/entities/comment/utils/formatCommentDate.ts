import { declineHours } from '@/shared/utils/declineWords/declineHours';
import { declineMinutes } from '@/shared/utils/declineWords/declineMinutes';
import dayjs from 'dayjs';

export const formatCommentDate = (createdAt: Date): string => {
  const date = dayjs(createdAt);
  const now = dayjs();

  const diffMinutes = now.diff(date, 'minute');
  if (now.isBefore(date) || diffMinutes === 0) {
    return 'Только что';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} ${declineMinutes(diffMinutes)} назад`;
  }

  const diffHours = now.diff(date, 'hour');
  if (diffHours < 3) {
    return `${diffHours} ${declineHours(diffHours)} назад`;
  }

  if (now.isSame(date, 'day')) {
    return `Сегодня в ${date.format('HH:mm')}`;
  }

  if (now.subtract(1, 'day').isSame(date, 'day')) {
    return `Вчера в ${date.format('HH:mm')}`;
  }

  if (now.isSame(date, 'year')) {
    return date.format('DD.MM HH:mm');
  }

  return date.format('DD.MM.YYYY HH:mm');
};
