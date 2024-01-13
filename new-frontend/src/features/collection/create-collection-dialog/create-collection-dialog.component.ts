import { NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
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
import { catchError, takeUntil } from 'rxjs';
import { CollectionService } from '../utils/collection.service';

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
  ) {
    this.setupImageUpload();
  }

  setupImageUpload() {
    this.fileControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((file: File | null) => {
      if (!file) {
        this.createCollectionForm.patchValue({ imageUrl: null });
        return;
      }

      this.createCollectionForm.markAsPending();
      return this.collectionService
        .uploadCollectionImage(file)
        .pipe(
          catchError((v) => {
            console.log(v);
            throw v;
          }),
        )
        .subscribe((v) => {
          console.log(v.link);
          this.createCollectionForm.markAsPristine();
        });
    });
  }

  createCollectionForm = this.fb.group({
    name: this.fb.control<string>('', { validators: Validators.required }),
    description: this.fb.control<string>('', { validators: Validators.maxLength(400) }),
    isPrivate: this.fb.control<boolean>(false),
    imageUrl: this.fb.control<string | null>(null),
  });

  fileControl = this.fb.control<File | null>(null);

  uploadState: UploadState = 'loaded';

  isLoading = false;

  get buttonDisabled() {
    return this.createCollectionForm.pending || this.isLoading || this.createCollectionForm.invalid;
  }

  createCollection() {
    console.log('some logic of creating collection');
  }
}
