import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiHintModule,
  TuiLoaderModule,
  TuiTooltipModule,
  tuiHintOptionsProvider,
} from '@taiga-ui/core';
import { TuiFieldErrorPipeModule, TuiInputModule, TuiTextareaModule } from '@taiga-ui/kit';
import { finalize, takeUntil } from 'rxjs';
import { AppState } from '../../app/store';
import { selectCurrentUser } from '../../entities/current-user/selectors';
import { maxLength, required } from '../../shared/utils/validators';
import { confirmPasswordValidator } from './utils/confirm-password-validator';
import { ProfileService } from '../../features/profile/profile.service';
import { NotificationService } from '../../app/utils/notification.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    TuiInputModule,
    TuiTextareaModule,
    TuiButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiHintModule,
    TuiFieldErrorPipeModule,
    NgIf,
    TuiTooltipModule,
    TuiLoaderModule,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    tuiHintOptionsProvider({
      icon: 'tuiIconAlertCircleLarge',
    }),
  ],
})
export class SettingsPageComponent implements OnInit {
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly destroy$: TuiDestroyService,
    private readonly profileService: ProfileService,
    private readonly notificationService: NotificationService,
  ) {}

  private currentUser$ = this.store.select(selectCurrentUser);

  settingsForm = this.fb.group({
    username: this.fb.control('', { validators: [required('Поле должно быть заполнено')] }),

    description: this.fb.control('', {
      validators: [maxLength(400, 'Максимальная длина описания – 400 символов')],
    }),

    imageUrl: this.fb.control<string | null>(null),

    password: this.fb.group(
      {
        old: this.fb.control(''),
        new: this.fb.control(''),
      },
      { validators: [confirmPasswordValidator('Пароли должны совпадать')] },
    ),
  });

  ngOnInit(): void {
    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe((currentUser) => {
      this.settingsForm.patchValue({
        username: currentUser?.username ?? '',
        description: currentUser?.description ?? '',
      });
    });
  }

  submitting = signal(false);

  get passwordChangeErrors() {
    const error = this.settingsForm.controls.password.errors?.['passwordMatch'];
    return error ? [error] : null;
  }

  get canSave() {
    return this.settingsForm.valid || this.submitting();
  }

  save() {
    if (!this.canSave) {
      return;
    }

    const values = this.settingsForm.value;

    const changePassword = Boolean(values.password?.new);

    this.submitting.set(true);

    this.profileService
      .editProfile({
        username: values.username ?? undefined,
        description: values.description ?? null,
        imageUrl: values.imageUrl,
        password: changePassword
          ? {
              old: values.password?.old!,
              new: values.password?.new!,
            }
          : undefined,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe(() => {
        this.notificationService.createSuccessMessage('Профиль успешно изменен');
      });
  }
}
