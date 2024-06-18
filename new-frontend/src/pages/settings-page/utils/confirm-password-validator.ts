import { ValidationErrors, ValidatorFn } from '@angular/forms';

export const confirmPasswordValidator: (message: string) => ValidatorFn =
  (message: string) =>
  (control): ValidationErrors | null => {
    return control.value.old === control.value.new ? null : { passwordMatch: message };
  };
