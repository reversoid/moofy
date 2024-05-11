import { ComponentStore } from '@ngrx/component-store';
import { Injectable } from '@angular/core';

type Search = string | null;

type State = {
  search: Search;
};

@Injectable()
export class ExplorePageStore extends ComponentStore<State> {
  constructor() {
    super({ search: null });
  }

  search$ = this.select((s) => s.search);

  setSearch = this.updater((s, newSearch: string | null) => ({ ...s, search: newSearch }));
}
