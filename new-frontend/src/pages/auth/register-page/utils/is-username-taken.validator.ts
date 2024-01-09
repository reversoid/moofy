import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../../features/auth/auth.service';
import { Observable, debounceTime, distinctUntilChanged, first, map, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IsUsernameTakenValidator implements AsyncValidator {
  constructor(private readonly authService: AuthService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return control.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap((value) =>
        this.authService
          .userExists(value)
          .pipe(
            map((exists) => (exists ? { usernameTaken: 'Имя пользователя уже занято' } : null)),
          ),
      ),
      first(),
    );
  }
}
