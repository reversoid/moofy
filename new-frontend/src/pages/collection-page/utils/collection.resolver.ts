import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import {
  CollectionService,
  FullCollection,
} from '../../../features/collection/utils/collection.service';

// TODO in guard check if is number
export const CollectionResolver: ResolveFn<FullCollection | null> = (
  route: ActivatedRouteSnapshot,
) => {
  return inject(CollectionService).getCollection(Number(route.paramMap.get('id')));
};
