import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Profile } from '../../../shared/types';
import { inject } from '@angular/core';
import { ProfileService } from '../../../features/profile/profile.service';

// TODO in guard check if is number
export const ProfileResolver: ResolveFn<Profile | null> = (route: ActivatedRouteSnapshot) => {
  return inject(ProfileService).getProfile(Number(route.paramMap.get('id')));
};
