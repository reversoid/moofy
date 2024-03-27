import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { CollectionService } from '../../../features/collection/utils/collection.service';
import { FullCollection } from '../../../shared/types';

// TODO in guard check if is number
export const CollectionResolver: ResolveFn<FullCollection | null> = (
  route: ActivatedRouteSnapshot,
) => {
  return inject(CollectionService).getCollection(Number(route.paramMap.get('id')));
};
