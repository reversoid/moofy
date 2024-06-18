import { Injectable } from '@angular/core';
import { ImageTooLargeError, ImageWrongFormatError } from './errors';
import { getFileExtension, getFileSizeInMb } from '../file';
import { MAX_IMAGE_UPLOAD_SIZE_MB, SUPPORTED_IMAGE_EXTENSIONS } from './consts';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadImageService {
  constructor(private readonly http: HttpClient) {}

  uploadImage(resource: 'profile' | 'collection', file: File): Observable<{ link: string }> {
    try {
      this.validateImage(file);
    } catch (e) {
      return throwError(() => e);
    }

    const formData = this.createFormData(file);

    return this.http.post<{ link: string }>('image', formData, { params: { resource } }).pipe(
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
