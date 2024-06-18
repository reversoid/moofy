import { ResolveFn } from '@angular/router';
import { CollectionWithInfo, PaginatedData } from '../../../shared/types';
import { inject } from '@angular/core';
import { CollectionService } from '../../../features/collection/utils/collection.service';

export const MyCollectionsResolver: ResolveFn<PaginatedData<CollectionWithInfo>> = () => {
  return inject(CollectionService).getCollections();
};
