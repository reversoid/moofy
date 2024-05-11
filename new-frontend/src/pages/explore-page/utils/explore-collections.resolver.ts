import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { CollectionWithInfo } from '../../../shared/types';
import { inject } from '@angular/core';
import { ExploreService } from '../../../features/explore/explore.service';
import { map } from 'rxjs';

export const ExploreCollectionsResolver: ResolveFn<CollectionWithInfo[]> = (
  route: ActivatedRouteSnapshot,
) => {
  const service = inject(ExploreService);

  const search = route.queryParamMap.get('search');

  return service.searchCollections(search || undefined).pipe(map((d) => d.items));
};
