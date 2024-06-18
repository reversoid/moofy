import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CollectionService } from '../../../features/collection/utils/collection.service';
import { CollectionWithInfo, PaginatedData } from '../../../shared/types';

export const FavoriteCollectionsResolver: ResolveFn<PaginatedData<CollectionWithInfo>> = () => {
  return inject(CollectionService).getFavoriteCollections();
};
