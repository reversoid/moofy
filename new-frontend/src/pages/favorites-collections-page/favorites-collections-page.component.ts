import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { CollectionGridComponent } from '../../widgets/collection-grid/collection-grid.component';
import { TuiInputModule } from '@taiga-ui/kit';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { ActivatedRoute } from '@angular/router';
import { CollectionWithInfo, PaginatedData } from '../../shared/types';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { finalize, map, takeUntil } from 'rxjs';
import { CollectionService } from '../../features/collection/utils/collection.service';

@Component({
  selector: 'app-favorites-collections-page',
  standalone: true,
  imports: [CollectionGridComponent, TuiInputModule, TuiTextfieldControllerModule],
  templateUrl: './favorites-collections-page.component.html',
  styleUrl: './favorites-collections-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class FavoritesCollectionsPageComponent implements OnInit {
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly collectionService: CollectionService,
    private readonly destroy$: TuiDestroyService,
  ) {}

  private favCollections = signal<PaginatedData<CollectionWithInfo> | null>(null);

  loading = signal(false);

  collections = computed(() => this.favCollections()!.items.map((c) => c.collection));

  loadKey = computed(() => this.favCollections()?.nextKey ?? null);

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(
        map((data) => data['collections'] as PaginatedData<CollectionWithInfo>),
        takeUntil(this.destroy$),
      )
      .subscribe((collections) => {
        this.favCollections.set(collections);
      });
  }

  loadMore(loadKey: string) {
    this.loading.set(true);
    this.collectionService
      .getFavoriteCollections(loadKey)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntil(this.destroy$),
      )
      .subscribe((data) => {
        this.favCollections.update((c) => ({
          items: [...(c?.items ?? []), ...data.items],
          nextKey: data.nextKey,
        }));
      });
  }
}
