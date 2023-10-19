export function declineHours(num: number) {
  let lastDigit = num % 10;
  let lastTwoDigits = num % 100;

  if (lastTwoDigits > 10 && lastTwoDigits < 20) {
    return 'часов';
  }
  if (lastDigit === 1) {
    return 'час';
  }
  if (lastDigit > 1 && lastDigit < 5) {
    return 'часа';
  }

  return 'часов';
}
