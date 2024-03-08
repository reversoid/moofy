import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Collection,
  CollectionWithInfo,
  Comment,
  CommentWithInfo,
  FullCollection,
  PaginatedData,
} from '../../../shared/types';
import { UploadImageService } from '../../../shared/utils/upload-image/upload-image.service';
import { CreateCollectionProps, SendCommentDto, UpdateCollectionProps } from './types';

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

  likeCollection(id: Collection['id']) {
    return this.http.put<{ likesAmount: number; commentsAmount: number }>(
      `collections/${id}/likes`,
      {},
    );
  }

  bookmarkCollection(id: Collection['id']) {
    return this.http.put<void>(`collections/favorites/${id}`, {});
  }

  unbookmarkCollection(id: Collection['id']) {
    return this.http.delete<void>(`collections/favorites/${id}`);
  }

  unlikeCollection(id: Collection['id']) {
    return this.http.delete<{ likesAmount: number; commentsAmount: number }>(
      `collections/${id}/likes`,
    );
  }

  getComments(id: Collection['id'], nextKey?: string) {
    return this.http.get<PaginatedData<CommentWithInfo>>(`collections/${id}/comments`, {
      params: nextKey ? { nextKey } : undefined,
    });
  }

  sendComment(id: Collection['id'], dto: SendCommentDto) {
    return this.http.post<CommentWithInfo>(`collections/${id}/comments`, dto);
  }

  removeComment(id: Comment['id']) {
    return this.http.delete<void>(`collections/${id}/comments`);
  }

  likeComment(id: Comment['id']) {
    return this.http.put<{ likesAmount: number; repliesAmount: number }>(
      `collections/${id}/comments`,
      {},
    );
  }

  unlikeComment(id: Comment['id']) {
    return this.http.delete<{ likesAmount: number; repliesAmount: number }>(
      `collections/${id}/comments`,
    );
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
