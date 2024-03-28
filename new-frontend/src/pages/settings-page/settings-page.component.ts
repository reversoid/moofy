import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';
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
import {
  TuiFieldErrorPipeModule,
  TuiInputFilesModule,
  TuiInputModule,
  TuiMarkerIconModule,
  TuiTextareaModule,
} from '@taiga-ui/kit';
import { EMPTY, catchError, delay, filter, finalize, mergeMap, takeUntil, tap } from 'rxjs';
import { AppState } from '../../app/store';
import { selectCurrentUser } from '../../entities/current-user/selectors';
import { maxLength, required } from '../../shared/utils/validators';
import { confirmPasswordValidator } from './utils/confirm-password-validator';
import { ProfileService } from '../../features/profile/profile.service';
import { NotificationService } from '../../app/utils/notification.service';
import { EditProfileDto } from '../../features/profile/types';
import { currentUserActions } from '../../entities/current-user/actions';
import { ImageTooLargeError, ImageWrongFormatError } from '../../shared/utils/upload-image/errors';
import { SUPPORTED_IMAGE_EXTENSIONS } from '../../shared/utils/upload-image/consts';

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
    TuiInputFilesModule,
    TuiMarkerIconModule,
    NgOptimizedImage,
    NgClass,
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
    this.setupImageUpload();

    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe((currentUser) => {
      this.settingsForm.patchValue({
        username: currentUser?.username ?? '',
        description: currentUser?.description ?? '',
      });
    });
  }

  imageControl = this.fb.control<File | null>(null);

  // TODO get from form
  imageUploadState = signal<'loaded' | 'notLoaded' | 'loading'>('notLoaded');

  readonly imageAccept = SUPPORTED_IMAGE_EXTENSIONS.map((v) => `.${v}`).join(',');

  readonly maxFileSize = Number.POSITIVE_INFINITY;

  private setupImageUpload() {
    this.imageControl.valueChanges
      .pipe(
        tap((file) => {
          if (!file) this.settingsForm.patchValue({ imageUrl: null });
        }),
        filter(Boolean),
        tap(() => {
          this.imageUploadState.set('loading');
        }),
        mergeMap((f) =>
          this.profileService.uploadProfileImage(f).pipe(
            delay(1000),
            tap({
              error: () => {
                this.imageUploadState.set(
                  this.settingsForm.controls.imageUrl.value ? 'loaded' : 'notLoaded',
                );
              },
            }),
            catchError((e) => {
              if (e instanceof ImageWrongFormatError) {
                this.notificationService.createError('Неверное расширение файла');
              }

              if (e instanceof ImageTooLargeError) {
                this.notificationService.createError('Слишком большой файл');
              }

              return EMPTY;
            }),
          ),
        ),
        tap({
          next: ({ link }) => {
            this.imageUploadState.set('loaded');
            this.settingsForm.patchValue({ imageUrl: link });
          },
        }),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe();
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

    const dto: EditProfileDto = {
      username: values.username ?? undefined,
      description: values.description || null,
      imageUrl: values.imageUrl,
      password: changePassword
        ? {
            old: values.password?.old!,
            new: values.password?.new!,
          }
        : undefined,
    };

    this.submitting.set(true);
    this.profileService
      .editProfile(dto)
      .pipe(
        finalize(() => this.submitting.set(false)),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.notificationService.createSuccessMessage('Профиль успешно изменен');

        this.store.dispatch(
          currentUserActions.edit({
            username: dto.username,
            description: dto.description,
            imageUrl: dto.imageUrl,
          }),
        );
      });
  }
}
