import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  TuiButtonModule,
  TuiHintModule,
  TuiLinkModule,
  tuiHintOptionsProvider,
} from '@taiga-ui/core';
import {
  TUI_PASSWORD_TEXTS,
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputPasswordModule,
  tuiInputPasswordOptionsProvider,
} from '@taiga-ui/kit';
import { pattern, required } from '../../../shared/utils/validators';
import { USERNAME_PATTERN } from '../utils/username-pattern';
import { NO_WHITESPACE_PATTERN } from '../utils/no-whitespace-pattern';
import { AuthService } from '../../../features/auth/auth.service';
import { finalize, of, takeUntil } from 'rxjs';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app/store';
import { currentUserActions } from '../../../entities/current-user/actions';
import { NotificationService } from '../../../app/utils/notification.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    TuiInputModule,
    TuiButtonModule,
    RouterModule,
    TuiLinkModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputPasswordModule,
    TuiFieldErrorPipeModule,
    TuiHintModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
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
export class LoginPageComponent {
  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly destroy$: TuiDestroyService,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
  ) {}

  isLoading = signal(false);

  loginForm = this.fb.group({
    username: this.fb.control('', {
      validators: [
        required('Поле должно быть заполнено'),
        pattern(USERNAME_PATTERN, 'Допустимы латинские буквы, цифры, точки, нижние подчеркивания'),
        pattern(NO_WHITESPACE_PATTERN, 'Пробелы недопустимы'),
      ],
    }),
    password: this.fb.control('', {
      validators: [
        required('Поле должно быть заполнено'),
        pattern(NO_WHITESPACE_PATTERN, 'Пробелы недопустимы'),
      ],
    }),
  });

  get buttonDisabled() {
    return this.loginForm.invalid || this.isLoading();
  }

  login() {
    const { username, password } = this.loginForm.value;

    this.isLoading.set(true);
    this.authService
      .login(username!, password!)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (v) => {
          this.store.dispatch(currentUserActions.set({ user: v.user }));
          this.router.navigateByUrl('');
        },
        error: () => {
          this.notificationService.createError('Неправильный логин или пароль');
        },
      });
  }
}
