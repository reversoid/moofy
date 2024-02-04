import { NgIf, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
import { SUPPORTED_IMAGE_EXTENSIONS } from '../../../shared/utils/file';
import { CollectionService } from '../utils/collection.service';
import { ImageTooLargeError, ImageWrongFormatError } from '../utils/errors';

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
    private readonly cdr: ChangeDetectorRef,
  ) {}

  @Input() formSubmitting = false;

  @Input() collectionDto?: CollectionDto;

  @Input({ required: true }) submutButtonText!: string;

  @Output() collectionSubmit = new EventEmitter<CollectionDto>();

  collectionForm = this.fb.group({
    name: this.fb.control<string>('', { validators: Validators.required }),
    description: this.fb.control<string>('', { validators: Validators.maxLength(400) }),
    isPrivate: this.fb.control<boolean>(false),
    imageUrl: this.fb.control<string | null>(null),
  });

  fileControl = this.fb.control<File | null>(null);

  uploadState: ImageUploadState = 'notLoaded';

  readonly imageAccept = SUPPORTED_IMAGE_EXTENSIONS.map((v) => `.${v}`).join(',');

  readonly maxFileSize = Number.POSITIVE_INFINITY;

  get shouldNotSubmitCollection() {
    return this.uploadState === 'loading' || this.collectionForm.invalid || this.formSubmitting;
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
    console.log(this.collectionDto?.isPrivate);

    if (this.collectionDto) {
      this.collectionForm.setValue({
        name: this.collectionDto.name,
        description: this.collectionDto.description,
        imageUrl: this.collectionDto.description,
        isPrivate: this.collectionDto.isPrivate,
      });
    }
  }

  private setupInitialUploadState() {
    this.uploadState = this.collectionDto?.imageUrl ? 'loaded' : 'notLoaded';
  }

  private setupImageUpload() {
    this.fileControl.valueChanges
      .pipe(
        tap((file) => {
          if (!file) this.collectionForm.patchValue({ imageUrl: null });
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
            this.collectionForm.patchValue({ imageUrl: link });
            this.cdr.markForCheck();
          },
        }),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
