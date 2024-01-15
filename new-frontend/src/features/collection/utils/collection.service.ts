import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import {
  MAX_IMAGE_UPLOAD_SIZE_MB,
  SUPPORTED_IMAGE_EXTENSIONS,
  getFileExtension,
  getFileSizeInMb,
} from '../../../shared/utils/file';
import { ImageTooLargeError, ImageWrongFormatError } from './errors';
import { CreateCollectionProps, UpdateCollectionProps } from './types';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  constructor(private readonly http: HttpClient) {}

  uploadCollectionImage(file: File): Observable<{ link: string }> {
    try {
      this.validateImage(file);
    } catch (e) {
      return throwError(() => e);
    }

    const formData = this.createFormData(file);

    return this.http.post<{ link: string }>('collections/image-upload', formData).pipe(
      catchError((e) => {
        if (e instanceof HttpErrorResponse) {
          if (e.error.message === 'IMAGE_WRONG_FORMAT') {
            throw new ImageWrongFormatError();
          }

          if (e.error.message === 'IMAGE_TOO_LARGE') {
            throw new ImageTooLargeError();
          }
        }

        throw e;
      }),
    );
  }

  createCollection(props: CreateCollectionProps) {}

  updateCollection(props: UpdateCollectionProps) {}

  private validateImage(file: File): File {
    if (!SUPPORTED_IMAGE_EXTENSIONS.includes(getFileExtension(file))) {
      throw new ImageWrongFormatError();
    }

    if (getFileSizeInMb(file) > MAX_IMAGE_UPLOAD_SIZE_MB) {
      throw new ImageTooLargeError();
    }

    return file;
  }

  private createFormData(file: File): FormData {
    const formData = new FormData();
    formData.append('image', file);
    return formData;
  }
}