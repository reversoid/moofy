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

type PersonalCollectionData = {
  collectionData?: CollectionData;
  collectionIdsToMerge?: CollectionIds;
  combineOptions?: CombineOptions;
};

@Injectable({ providedIn: 'root' })
export class CreatePersonalCollectionFlowService {
  private _newPersonalCollectionData: PersonalCollectionData = {};

  get newPersonalCollectionData(): Required<PersonalCollectionData> | null {
    const filledValues = Object.values(this._newPersonalCollectionData);

    if (filledValues.length > 0 && filledValues.every(Boolean)) {
      return this._newPersonalCollectionData as Required<PersonalCollectionData>;
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
