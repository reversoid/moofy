import { NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiCheckboxLabeledModule,
  TuiInputFilesModule,
  TuiInputModule,
  TuiMarkerIconModule,
  TuiTextareaModule,
} from '@taiga-ui/kit';
import { catchError, filter, mergeMap, of, takeUntil, tap } from 'rxjs';
import { CollectionService } from '../utils/collection.service';
import { ImageTooLargeError, ImageWrongFormatError } from '../utils/errors';
import { SUPPORTED_IMAGE_EXTENSIONS } from '../../../shared/utils/file';
import { NotificationService } from '../../../app/utils/notification.service';

type UploadState = 'loading' | 'loaded' | 'notLoaded';

@Component({
  selector: 'app-create-collection-dialog',
  standalone: true,
  imports: [
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiTextareaModule,
    TuiCheckboxLabeledModule,
    TuiButtonModule,
    TuiInputFilesModule,
    TuiMarkerIconModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    TuiLinkModule,
    TuiLoaderModule,
    TuiSvgModule,
    NgOptimizedImage,
  ],
  templateUrl: './create-collection-dialog.component.html',
  styleUrl: './create-collection-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class CreateCollectionDialogComponent {
  constructor(
    private readonly fb: FormBuilder,
    private readonly destroy$: TuiDestroyService,
    private readonly collectionService: CollectionService,
    private readonly notificationService: NotificationService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.setupImageUpload();
  }

  setupImageUpload() {
    this.fileControl.valueChanges
      .pipe(
        tap((file) => {
          if (!file) this.createCollectionForm.patchValue({ imageUrl: null });
        }),
        filter(Boolean),
        tap(() => {
          this.uploadState = 'loading';
          this.cdr.markForCheck();
        }),
        mergeMap((f) => this.collectionService.uploadCollectionImage(f)),
        tap(() => {
          this.uploadState = 'loaded';
          this.cdr.markForCheck();
        }),
        catchError((e) => {
          this.uploadState = 'notLoaded';
          throw e;
        }),
        catchError((e) => {
          if (e instanceof ImageWrongFormatError) {
            this.notificationService.createError('Неверное расширение файла');
          }

          if (e instanceof ImageTooLargeError) {
            this.notificationService.createError('Файл очень большой');
          }
          return of();
        }),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  createCollectionForm = this.fb.group({
    name: this.fb.control<string>('', { validators: Validators.required }),
    description: this.fb.control<string>('', { validators: Validators.maxLength(400) }),
    isPrivate: this.fb.control<boolean>(false),
    imageUrl: this.fb.control<string | null>(null),
  });

  fileControl = this.fb.control<File | null>(null);

  uploadState: UploadState = 'notLoaded';

  isLoading = false;

  get shouldNotCreateCollection() {
    return this.isLoading || this.createCollectionForm.invalid;
  }

  createCollection() {
    if (this.shouldNotCreateCollection) {
      return;
    }
  }

  imageAccept = SUPPORTED_IMAGE_EXTENSIONS.map((v) => `.${v}`).join(',');
}
