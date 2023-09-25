export function declineMinutes(num: number): string {
  let lastDigit = num % 10;
  let lastTwoDigits = num % 100;

  if (lastTwoDigits > 10 && lastTwoDigits < 20) {
    return 'минут';
  }
  if (lastDigit === 1) {
    return 'минута';
  }
  if (lastDigit > 1 && lastDigit < 5) {
    return 'минуты';
  }

  return 'минут';
}
