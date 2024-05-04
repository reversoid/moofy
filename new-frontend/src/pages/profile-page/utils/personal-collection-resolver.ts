import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { FullCollection } from '../../../shared/types';
import { inject } from '@angular/core';
import { ProfileService } from '../../../features/profile/utils/profile.service';

export const PersonalCollectionResolver: ResolveFn<FullCollection | null> = (
  route: ActivatedRouteSnapshot,
) => {
  return inject(ProfileService).getPersonalCollection(Number(route.paramMap.get('id')));
};
