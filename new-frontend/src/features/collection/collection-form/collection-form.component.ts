import { NgIf, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
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
import { EMPTY, catchError, filter, mergeMap, takeUntil, tap } from 'rxjs';
import { NotificationService } from '../../../app/utils/notification.service';
import { CollectionService } from '../utils/collection.service';
import { Collection } from '../../../shared/types';
import { SUPPORTED_IMAGE_EXTENSIONS } from '../../../shared/utils/upload-image/consts';
import {
  ImageTooLargeError,
  ImageWrongFormatError,
} from '../../../shared/utils/upload-image/errors';

export type CollectionDto = {
  description: string | null;
  imageUrl: string | null;
  isPrivate: boolean;
  name: string;
};

type ImageUploadState = 'loading' | 'loaded' | 'notLoaded';

@Component({
  selector: 'app-collection-form',
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
    NgIf,
  ],
  templateUrl: './collection-form.component.html',
  styleUrl: './collection-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class CollectionFormComponent implements OnInit {
  constructor(
    private readonly fb: FormBuilder,
    private readonly destroy$: TuiDestroyService,
    private readonly collectionService: CollectionService,
    private readonly notificationService: NotificationService,
  ) {}

  @Input() isFormSubmitting = false;

  @Input() disableSubmit = false;

  @Input() collection?: Collection;

  @Input() removeIsPrivate = false;

  @Input({ required: true }) submutButtonText!: string;

  @Output() collectionSubmit = new EventEmitter<CollectionDto>();

  collectionForm = this.fb.group({
    name: this.fb.control<string>('', { validators: Validators.required }),
    description: this.fb.control<string>('', { validators: Validators.maxLength(400) }),
    isPrivate: this.fb.control<boolean>(false),
    imageUrl: this.fb.control<string | null>(null),
  });

  fileControl = this.fb.control<File | null>(null);

  readonly uploadState = signal<ImageUploadState>('notLoaded');

  readonly imageAccept = SUPPORTED_IMAGE_EXTENSIONS.map((v) => `.${v}`).join(',');

  readonly maxFileSize = Number.POSITIVE_INFINITY;

  get shouldNotSubmitCollection() {
    return (
      this.disableSubmit ||
      this.uploadState() === 'loading' ||
      this.collectionForm.invalid ||
      this.isFormSubmitting
    );
  }

  get uploadedImageUrl(): string | null {
    return this.collectionForm.controls.imageUrl.getRawValue();
  }

  ngOnInit(): void {
    this.setupImageUpload();
    this.setupInitialForm();
    this.setupInitialUploadState();
  }

  submitCollection() {
    if (this.shouldNotSubmitCollection) {
      return;
    }

    const { description, imageUrl, isPrivate, name } = this.collectionForm.getRawValue();

    this.collectionSubmit.emit({
      description: description || null,
      imageUrl: imageUrl || null,
      isPrivate: isPrivate || false,
      name: name || '',
    });
  }

  private setupInitialForm() {
    if (this.collection) {
      this.collectionForm.setValue({
        name: this.collection.name,
        description: this.collection.description,
        imageUrl: this.collection.imageUrl,
        isPrivate: !this.collection.isPublic,
      });
    }
  }

  private setupInitialUploadState() {
    this.uploadState.set(this.collection?.imageUrl ? 'loaded' : 'notLoaded');
  }

  private setupImageUpload() {
    this.fileControl.valueChanges
      .pipe(
        tap((file) => {
          if (!file) this.collectionForm.patchValue({ imageUrl: null });
        }),
        filter(Boolean),
        tap(() => {
          this.uploadState.set('loading');
        }),
        mergeMap((f) =>
          this.collectionService.uploadCollectionImage(f).pipe(
            tap({
              error: () => {
                this.uploadState.set(this.uploadedImageUrl ? 'loaded' : 'notLoaded');
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
            this.uploadState.set('loaded');
            this.collectionForm.patchValue({ imageUrl: link });
          },
        }),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
