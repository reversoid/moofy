import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { CollectionService } from '../../../features/collection/utils/collection.service';
import { CollectionWithInfo, PaginatedData, Review } from '../../../shared/types';

// TODO in guard check if is number
export const CollectionResolver: ResolveFn<
  CollectionWithInfo & { reviews: PaginatedData<Review> }
> = (route: ActivatedRouteSnapshot) => {
  return inject(CollectionService).getCollection(Number(route.paramMap.get('id')));
};
