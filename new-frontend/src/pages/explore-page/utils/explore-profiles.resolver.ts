import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ShortProfile } from '../../../shared/types';
import { inject } from '@angular/core';
import { ExploreService } from '../../../features/explore/explore.service';
import { map } from 'rxjs';

export const ExploreProfilesResolver: ResolveFn<ShortProfile[]> = (
  route: ActivatedRouteSnapshot,
) => {
  const service = inject(ExploreService);

  const search = route.queryParamMap.get('search');

  if (search) {
    return service.searchProfiles(search).pipe(map((r) => r.items));
  }

  return service.getTopProfiles().pipe(map((r) => r.items));
};
