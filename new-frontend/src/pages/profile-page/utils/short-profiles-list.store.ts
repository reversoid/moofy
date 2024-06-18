import { Injectable } from '@angular/core';
import { PaginatedData, ShortProfile } from '../../../shared/types';
import { ComponentStore } from '@ngrx/component-store';

export interface ShortProfileListState {
  profiles: PaginatedData<ShortProfile>;
}

@Injectable()
export class ShortProfileListStore extends ComponentStore<ShortProfileListState> {
  constructor() {
    super({ profiles: { items: [], nextKey: null } });
  }

  profiles$ = this.select((s) => s.profiles);

  appendProfiles = this.updater((state, paginatedProfiles: PaginatedData<ShortProfile>) => ({
    profiles: {
      nextKey: paginatedProfiles.nextKey,
      items: [...state.profiles.items, ...paginatedProfiles.items],
    },
  }));
}
