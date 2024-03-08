import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Collection,
  CollectionWithInfo,
  FullCollection,
  PaginatedData,
} from '../../../shared/types';
import { UploadImageService } from '../../../shared/utils/upload-image/upload-image.service';
import { CreateCollectionProps, UpdateCollectionProps } from './types';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  constructor(
    private readonly http: HttpClient,
    private readonly uploadImageService: UploadImageService,
  ) {}

  getCollections() {
    return this.http.get<PaginatedData<CollectionWithInfo>>('profile/collections');
  }

  getCollection(id: Collection['id']) {
    return this.http.get<FullCollection>(`collections/${id}`);
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
    return this.uploadImageService.uploadImage('collections/image-upload', file);
  }
}
