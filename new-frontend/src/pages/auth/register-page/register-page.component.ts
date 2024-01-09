import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiHintModule,
  TuiSvgModule,
  tuiHintOptionsProvider,
} from '@taiga-ui/core';
import {
  TUI_PASSWORD_TEXTS,
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputPasswordModule,
  tuiInputPasswordOptionsProvider,
} from '@taiga-ui/kit';
import { finalize, of, takeUntil } from 'rxjs';
import { AuthService } from '../../../features/auth/auth.service';
import { USERNAME_PATTERN } from '../utils/username-pattern';
import { IsUsernameTakenValidator } from './utils/is-username-taken.validator';
import { AsyncPipe } from '@angular/common';
import { maxLength, minLength, pattern, required } from '../../../shared/utils/validators';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    TuiInputModule,
    TuiButtonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    AsyncPipe,
    TuiFieldErrorPipeModule,
    TuiHintModule,
    TuiSvgModule,
    TuiInputPasswordModule,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    tuiInputPasswordOptionsProvider({
      icons: {
        hide: 'tuiIconUnlockLarge',
        show: 'tuiIconLockLarge',
      },
    }),
    {
      provide: TUI_PASSWORD_TEXTS,
      useValue: of(['']),
    },
    tuiHintOptionsProvider({
      icon: 'tuiIconAlertCircleLarge',
    }),
  ],
})
export class RegisterPageComponent {
  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly destroy$: TuiDestroyService,
    private readonly isUsernameTakenValidator: IsUsernameTakenValidator,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  isLoading = false;

  registerForm = this.fb.group({
    username: this.fb.control('', {
      validators: [
        required('Поле должно быть заполнено'),
        pattern(USERNAME_PATTERN, `Допустимы латинские буквы, цифры, точки, нижние подчеркивания`),
      ],
      asyncValidators: [this.isUsernameTakenValidator.validate.bind(this.isUsernameTakenValidator)],
    }),
    password: this.fb.control('', {
      validators: [
        required('Поле должно быть заполнено'),
        minLength(8, 'Минимальная длина пароля – 8 символов'),
        maxLength(1024, 'Очень длинный пароль'),
      ],
    }),
  });

  get buttonDisabled() {
    return this.registerForm.invalid || this.registerForm.pending || this.isLoading;
  }

  register() {
    const { username, password } = this.registerForm.value;

    this.isLoading = true;
    this.authService
      .register(username!, password!)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe((v) => {
        console.log(v);
      });
  }
}
