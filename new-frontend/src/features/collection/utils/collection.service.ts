import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateCollectionProps, UpdateCollectionProps } from './types';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import {
  MAX_IMAGE_UPLOAD_SIZE_MB,
  SUPPORTED_IMAGE_EXTENSIONS,
  getFileExtension,
  getFileSizeInMb,
} from '../../../shared/utils/file';
import { ImageTooLargeError, WrongImageExtensionError } from './errors';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  constructor(private readonly http: HttpClient) {}

  uploadCollectionImage(file: File): Observable<{ link: string }> {
    return of(file).pipe(
      this.validateImage,
      this.createFormData,
      switchMap((formData) => {
        return this.http.post<{ link: string }>('collections/image-upload', formData);
      }),
      catchError((e) => {
        if (e instanceof HttpErrorResponse) {
          if (e.error.message === 'IMAGE_WRONG_FORMAT') {
            throw new WrongImageExtensionError();
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

  private validateImage(source: Observable<File>): Observable<File> {
    return source.pipe(
      map((f) => {
        if (!SUPPORTED_IMAGE_EXTENSIONS.includes(getFileExtension(f))) {
          throw new WrongImageExtensionError();
        }

        if (getFileSizeInMb(f) > MAX_IMAGE_UPLOAD_SIZE_MB) {
          throw new ImageTooLargeError();
        }

        return f;
      }),
    );
  }

  private createFormData(source: Observable<File>): Observable<FormData> {
    return source.pipe(
      map((file) => {
        const formData = new FormData();
        formData.append('image', file);
        return formData;
      }),
    );
  }
}
