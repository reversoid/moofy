import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { finalize, map, switchMap, takeUntil, tap } from 'rxjs';
import { ExploreService } from '../../../features/explore/explore.service';
import { Collection, CollectionWithInfo } from '../../../shared/types';
import { CollectionGridComponent } from '../../../widgets/collection-grid/collection-grid.component';
import { ExplorePageStore } from '../model/explore-page.store';

@Component({
  selector: 'app-explore-collections-page',
  standalone: true,
  imports: [CollectionGridComponent],
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
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  loading = signal(false);

  collections = signal<Collection[]>([]);

  ngOnInit(): void {
    this.setInitialCollections();

    this.initHandleSearchChange();
  }

  private setInitialCollections() {
    this.activatedRoute.data
      .pipe(
        map((data) => data['collections'] as CollectionWithInfo[]),
        takeUntil(this.destroy$),
      )
      .subscribe((collections) => {
        this.collections.set(collections.map((c) => c.collection));
      });
  }

  private initHandleSearchChange() {
    this.explorePageStore.search$
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap((search) => {
          return this.exploreService
            .searchCollections(search ?? '')
            .pipe(finalize(() => this.loading.set(false)));
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((result) => {
        this.collections.set(result.items.map((c) => c.collection));
      });
  }
}
