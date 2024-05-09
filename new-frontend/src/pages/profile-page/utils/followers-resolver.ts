import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { PaginatedData, ShortProfile } from '../../../shared/types';
import { inject } from '@angular/core';
import { ProfileService } from '../../../features/profile/utils/profile.service';

// TODO in guard check if is number
export const FollowersResolver: ResolveFn<PaginatedData<ShortProfile>> = (
  route: ActivatedRouteSnapshot,
) => {
  return inject(ProfileService).getFollowers(Number(route.paramMap.get('id')));
};
