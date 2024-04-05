import { ComponentStore } from '@ngrx/component-store';
import { CollectionWithInfo, ShortProfile } from '../../../shared/types';
import { Injectable } from '@angular/core';

type Search = string | null;

type SearchResult<T> = {
  items: T[];
  search: Search;
};

type State = {
  search: Search;
  profiles: SearchResult<ShortProfile> | null;
  collections: SearchResult<CollectionWithInfo> | null;
};

@Injectable()
export class ExplorePageStore extends ComponentStore<State> {
  constructor() {
    super({ collections: null, profiles: null, search: null });
  }

  search$ = this.select((s) => s.search);

  profiles$ = this.select((s) => s.profiles);

  collections$ = this.select((s) => s.collections);

  setSearch = this.updater((s, newSearch: string | null) => ({ ...s, search: newSearch }));

  setProfiles = this.updater((s, profiles: SearchResult<ShortProfile>) => ({ ...s, profiles }));

  setCollections = this.updater((s, collections: SearchResult<CollectionWithInfo>) => ({
    ...s,
    collections,
  }));
}
