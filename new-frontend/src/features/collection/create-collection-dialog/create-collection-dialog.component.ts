import { NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { catchError, filter, of, switchMap, takeUntil, tap } from 'rxjs';
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
export class CreateCollectionDialogComponent implements OnInit {
  constructor(
    private readonly fb: FormBuilder,
    private readonly destroy$: TuiDestroyService,
    private readonly collectionService: CollectionService,
    private readonly notificationService: NotificationService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.setupImageUpload();
  }

  setupImageUpload() {
    this.fileControl.valueChanges
      .pipe(
        tap((file) => {
          console.log('file', file);

          if (!file) this.createCollectionForm.patchValue({ imageUrl: null });
        }),
        filter(Boolean),
        tap(() => {
          this.uploadState = 'loading';
          this.cdr.markForCheck();
        }),
        switchMap((f) => this.collectionService.uploadCollectionImage(f)),
        tap(({ link }) => {
          this.uploadState = 'loaded';
          this.createCollectionForm.patchValue({ imageUrl: link });
          this.cdr.markForCheck();
        }),
        catchError((e) => {
          this.uploadState = this.uploadedImageUrl ? 'loaded' : 'notLoaded';
          this.cdr.markForCheck();

          throw e;
        }),
        catchError((e) => {
          if (e instanceof ImageWrongFormatError) {
            this.notificationService.createError('Неверное расширение файла');
          }

          if (e instanceof ImageTooLargeError) {
            this.notificationService.createError('Слишком большой файл');
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

  showReject(v: any) {
    console.log(v);
  }

  fileControl = this.fb.control<File | null>(null);

  uploadState: UploadState = 'notLoaded';

  isLoading = false;

  get shouldNotCreateCollection() {
    return this.isLoading || this.createCollectionForm.invalid;
  }

  get uploadedImageUrl(): string | null {
    return this.createCollectionForm.controls.imageUrl.getRawValue();
  }

  createCollection() {
    if (this.shouldNotCreateCollection) {
      return;
    }
  }

  imageAccept = SUPPORTED_IMAGE_EXTENSIONS.map((v) => `.${v}`).join(',');

  readonly maxFileSize = Number.POSITIVE_INFINITY;
}
