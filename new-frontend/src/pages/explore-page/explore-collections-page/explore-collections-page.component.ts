import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CollectionGridComponent } from '../../../widgets/collection-grid/collection-grid.component';
import { ExplorePageStore } from '../model/explore-page.store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { ExploreService } from '../../../features/explore/explore.service';
import { combineLatest, combineLatestWith, map, switchMap, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-explore-collections-page',
  standalone: true,
  imports: [CollectionGridComponent, AsyncPipe],
  templateUrl: './explore-collections-page.component.html',
  styleUrl: './explore-collections-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ExploreCollectionsPageComponent implements OnInit {
  constructor(
    private readonly explorePageStore: ExplorePageStore,
    private readonly destroy$: TuiDestroyService,
    private readonly exploreService: ExploreService,
  ) {}

  collections$ = combineLatest([
    this.explorePageStore.collections$,
    this.explorePageStore.search$,
  ]).pipe(
    map(([collections, search]) => {
      if (collections?.search === search) {
        return collections.items.map((c) => c.collection);
      }
      return null;
    }),
  );

  ngOnInit(): void {
    this.initHandleSearchChange();
  }

  private initHandleSearchChange() {
    this.explorePageStore.search$
      .pipe(
        switchMap((search) => {
          return this.exploreService.searchCollections(search ?? '');
        }),
        combineLatestWith(this.explorePageStore.search$),
        takeUntil(this.destroy$),
      )
      .subscribe(([result, search]) => {
        this.explorePageStore.setCollections({ search, items: result.items });
      });
  }
}
