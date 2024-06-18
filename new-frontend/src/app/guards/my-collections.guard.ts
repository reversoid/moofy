import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store';
import { selectCurrentUser } from '../../entities/current-user/selectors';
import { filter, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export const myCollectionGuard: CanActivateFn = () => {
  const store: Store<AppState> = inject(Store);
  const platformId = inject(PLATFORM_ID);

  //   TODO remove check platform browser ater when allowed login on server
  return store.select(selectCurrentUser).pipe(
    filter((u) => (isPlatformBrowser(platformId) ? u !== undefined : true)),
    map(Boolean),
  );
};
