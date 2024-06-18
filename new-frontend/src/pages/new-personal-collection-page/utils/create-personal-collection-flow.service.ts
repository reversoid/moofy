import { Injectable } from '@angular/core';
import { Collection } from '../../../shared/types';

type CollectionData = Pick<Collection, 'name' | 'description' | 'imageUrl'>;

type CollectionIds = number[];

type CombineOptions = {
  withScore: boolean;
  reviewsStrategy: 'copy' | 'move';
  actionAfterMerging: 'saveAll' | 'removeAll' | 'removeEmpty';
};

type StepWithPayload = {
  type: 'collectionData' | 'collectionIdsToMerge' | 'combineOptions';
} & (
  | { type: 'collectionData'; payload: CollectionData }
  | {
      type: 'collectionIdsToMerge';
      payload: CollectionIds;
    }
  | { type: 'combineOptions'; payload: CombineOptions }
);

type FinishedPersonalCollectionData = {
  collectionData: CollectionData;
  collectionIdsToMerge?: CollectionIds;
  combineOptions?: CombineOptions;
};

type PersonalCollectionData = Partial<FinishedPersonalCollectionData>;

@Injectable({ providedIn: 'root' })
export class CreatePersonalCollectionFlowService {
  private _newPersonalCollectionData: PersonalCollectionData = {};

  get newPersonalCollectionData(): FinishedPersonalCollectionData | null {
    const isEmptyCollectionCreating =
      this._newPersonalCollectionData.collectionData &&
      !this._newPersonalCollectionData.collectionIdsToMerge &&
      !this._newPersonalCollectionData.combineOptions;

    const isCombinedCollectionsCreating =
      this._newPersonalCollectionData.collectionData &&
      this._newPersonalCollectionData.collectionIdsToMerge &&
      this._newPersonalCollectionData.combineOptions;

    if (isEmptyCollectionCreating || isCombinedCollectionsCreating) {
      return this._newPersonalCollectionData as FinishedPersonalCollectionData;
    }

    return null;
  }

  completeStep(step: StepWithPayload) {
    if (step.type === 'collectionData') {
      this._newPersonalCollectionData.collectionData = step.payload;
    } else if (step.type === 'collectionIdsToMerge') {
      this._newPersonalCollectionData.collectionIdsToMerge = step.payload;
    } else if (step.type === 'combineOptions') {
      this._newPersonalCollectionData.combineOptions = step.payload;
    }
  }

  resetData() {
    this._newPersonalCollectionData = {};
  }
}
