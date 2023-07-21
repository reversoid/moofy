export const required =
  (message: string) =>
  <T>(value: T) =>
    value ? undefined : message;

export const minLength =
  (minLength: number, message: string) => (value: string) =>
    value.length < minLength ? message : undefined;

export const maxLength =
  (maxLength: number, message: string) => (value: string) =>
    value.length > maxLength ? message : undefined;

export const pattern =
  (pattern: RegExp, message: string) => (value: string) =>
    pattern.test(value) ? undefined : message;
