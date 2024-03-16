import { ValidatorFn, Validators } from '@angular/forms';

export function required(message: string): ValidatorFn {
  return (ctrl) => {
    const error = Validators.required(ctrl);
    return error ? { required: message } : null;
  };
}

export function minLength(value: number, message: string): ValidatorFn {
  return (ctrl) => {
    const error = Validators.minLength(value)(ctrl);
    return error ? { minLength: message } : null;
  };
}

export function maxLength(value: number, message: string): ValidatorFn {
  return (ctrl) => {
    const error = Validators.maxLength(value)(ctrl);
    return error ? { maxLength: message } : null;
  };
}

export function pattern(value: RegExp, message: string): ValidatorFn {
  return (ctrl) => {
    const error = Validators.pattern(value)(ctrl);
    return error ? { pattern: message } : null;
  };
}
