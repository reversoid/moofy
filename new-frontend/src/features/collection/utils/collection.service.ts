import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Collection, CollectionWithInfo, PaginatedData, Review } from '../../../shared/types';
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

  getCollections() {
    return this.http.get<PaginatedData<CollectionWithInfo>>('profile/collections');
  }

  getCollection(id: Collection['id']) {
    return this.http.get<{ collection: CollectionWithInfo; reviews: PaginatedData<Review> }>(
      `collections/${id}`,
    );
  }

  deleteCollection(id: Collection['id']) {
    return this.http.delete<void>(`collections/${id}`);
  }

  viewCollection(id: Collection['id']) {
    return this.http.post<void>(`collections/${id}/views`, {});
  }

  createCollection(props: CreateCollectionProps) {
    return this.http.post<CollectionWithInfo>('collections', {
      name: props.name,
      description: props.description,
      imageUrl: props.imageUrl,
      isPrivate: !props.isPublic,
    });
  }

  updateCollection(props: UpdateCollectionProps) {
    return this.http.patch<CollectionWithInfo>(`collections/${props.id}`, {
      name: props.name,
      description: props.description,
      imageUrl: props.imageUrl,
      isPrivate: !props.isPublic,
    });
  }

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
