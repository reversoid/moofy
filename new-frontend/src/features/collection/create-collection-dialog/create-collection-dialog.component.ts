import { NgIf, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDialogContext,
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
import { EMPTY, catchError, filter, mergeMap, takeUntil, tap } from 'rxjs';
import { NotificationService } from '../../../app/utils/notification.service';
import { SUPPORTED_IMAGE_EXTENSIONS } from '../../../shared/utils/file';
import { CollectionService } from '../utils/collection.service';
import { ImageTooLargeError, ImageWrongFormatError } from '../utils/errors';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { CollectionWithInfo } from '../../../shared/types';

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
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<CollectionWithInfo, void>,
  ) {}

  createCollectionForm = this.fb.group({
    name: this.fb.control<string>('', { validators: Validators.required }),
    description: this.fb.control<string>('', { validators: Validators.maxLength(400) }),
    isPrivate: this.fb.control<boolean>(false),
    imageUrl: this.fb.control<string | null>(null),
  });

  fileControl = this.fb.control<File | null>(null);

  uploadState: UploadState = 'notLoaded';

  isLoading = false;

  readonly imageAccept = SUPPORTED_IMAGE_EXTENSIONS.map((v) => `.${v}`).join(',');

  readonly maxFileSize = Number.POSITIVE_INFINITY;

  get shouldNotCreateCollection() {
    return this.isLoading || this.createCollectionForm.invalid;
  }

  get uploadedImageUrl(): string | null {
    return this.createCollectionForm.controls.imageUrl.getRawValue();
  }

  ngOnInit(): void {
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
        mergeMap((f) =>
          this.collectionService.uploadCollectionImage(f).pipe(
            tap({
              error: () => {
                this.uploadState = this.uploadedImageUrl ? 'loaded' : 'notLoaded';
                this.cdr.markForCheck();
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
            this.uploadState = 'loaded';
            this.createCollectionForm.patchValue({ imageUrl: link });
            this.cdr.markForCheck();
          },
        }),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  createCollection() {
    if (this.shouldNotCreateCollection) {
      return;
    }

    const { description, imageUrl, isPrivate, name } = this.createCollectionForm.getRawValue();

    this.collectionService
      .createCollection({
        description,
        imageUrl,
        isPublic: !isPrivate,
        name: name!,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((collectionWithInfo) => {
        this.context.completeWith(collectionWithInfo);
      });
  }
}
