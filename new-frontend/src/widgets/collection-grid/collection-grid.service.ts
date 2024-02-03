import { Injectable } from '@angular/core';

export type CollectionsView = 'list' | 'grid';

@Injectable()
export class CollectionGridService {
  collectionsView: CollectionsView = 'grid';

  toggleCollectionsView() {
    this.collectionsView = this.toggleViewMap[this.collectionsView];
  }

  get collectionsViewIcon() {
    return this.iconViewMap[this.collectionsView];
  }

  private readonly toggleViewMap: Record<CollectionsView, CollectionsView> = {
    grid: 'list',
    list: 'grid',
  };

  private readonly iconViewMap: Record<CollectionsView, string> = {
    grid: 'tuiIconGridLarge',
    list: 'tuiIconListLarge',
  };
}
