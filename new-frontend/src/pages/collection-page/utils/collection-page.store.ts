import { ComponentStore } from '@ngrx/component-store';
import { CollectionWithInfo, PaginatedData, Review } from '../../../shared/types';
import { Injectable } from '@angular/core';
import dayjs from 'dayjs';

export interface CollectionPageState {
  collectionData: CollectionWithInfo;
  reviews: PaginatedData<Review>;
}

@Injectable()
export class CollectionPageStore extends ComponentStore<CollectionPageState> {
  collection$ = this.select((s) => s.collectionData.collection);

  collectionName$ = this.select((s) => s.collectionData.collection.name);

  description$ = this.select((s) => s.collectionData.collection.description);

  creator$ = this.select((s) => s.collectionData.collection.user);

  updatedAt$ = this.select((s) => dayjs(s.collectionData.collection.updatedAt));

  imageUrl$ = this.select((s) => s.collectionData.collection.imageUrl);

  stats$ = this.select((c) => ({
    ...c.collectionData.socialStats,
    ...c.collectionData.additionalInfo,
  }));

  reviews$ = this.select((c) => c.reviews);

  addReview = this.updater((state, review: Review) => ({
    ...state,
    reviews: { ...state.reviews, items: [review, ...state.reviews.items] },
  }));

  removeReview = this.updater((state, reviewId: Review['id']) => ({
    ...state,
    reviews: { ...state.reviews, items: state.reviews.items.filter((r) => r.id !== reviewId) },
  }));

  updateReview = this.updater((state, review: Review) => {
    const existingReviewIndex = state.reviews.items.findIndex((r) => r.id === review.id);

    if (existingReviewIndex === -1) {
      return state;
    }

    const newReviews = [...state.reviews.items];
    newReviews[existingReviewIndex] = review;

    return { ...state, reviews: { ...state.reviews, items: newReviews } };
  });
}
