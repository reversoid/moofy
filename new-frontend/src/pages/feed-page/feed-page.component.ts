import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { TuiButtonModule, TuiNotificationModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { CollectionGridComponent } from '../../widgets/collection-grid/collection-grid.component';
import { FeedService } from '../../features/feed/utils/feed.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { finalize, map, takeUntil } from 'rxjs';
import { Collection, CollectionWithInfo, PaginatedData } from '../../shared/types';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feed-page',
  standalone: true,
  imports: [TuiIslandModule, TuiNotificationModule, CollectionGridComponent, TuiButtonModule],
  templateUrl: './feed-page.component.html',
  styleUrl: './feed-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class FeedPageComponent implements OnInit {
  constructor(
    private readonly feedService: FeedService,
    private readonly destroy$: TuiDestroyService,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(
        map(
          (data) =>
            data['feed'] as {
              latestUpdated: PaginatedData<CollectionWithInfo>;
              unseen: PaginatedData<CollectionWithInfo>;
            },
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(({ latestUpdated, unseen }) => {
        this.latestUpdatedCollections.update((v) => ({
          items: [...(v?.items ?? []), ...latestUpdated.items.map((c) => c.collection)],
          nextKey: latestUpdated.nextKey,
        }));

        this.latestUpdatedCollections.update((v) => ({
          items: [...(v?.items ?? []), ...unseen.items.map((c) => c.collection)],
          nextKey: unseen.nextKey,
        }));
      });
  }

  isLatestUpdatesLoading = signal(false);

  isUnseenLoading = signal(false);

  latestUpdatedCollections = signal<PaginatedData<Collection> | null>(null);

  unseenCollections = signal<PaginatedData<Collection> | null>(null);

  loadLatestUpdates(loadKey?: string) {
    this.isLatestUpdatesLoading.set(true);

    this.feedService
      .getLatestUpdatedCollections(loadKey)
      .pipe(
        finalize(() => this.isLatestUpdatesLoading.set(false)),
        takeUntil(this.destroy$),
      )
      .subscribe((result) => {
        this.latestUpdatedCollections.update((v) => ({
          items: [...(v?.items ?? []), ...result.items.map((c) => c.collection)],
          nextKey: result.nextKey,
        }));
      });
  }

  loadUnseen(loadKey?: string) {
    this.isUnseenLoading.set(true);

    this.feedService
      .getUnseenCollections(loadKey)
      .pipe(
        finalize(() => this.isUnseenLoading.set(false)),
        takeUntil(this.destroy$),
      )
      .subscribe((result) => {
        this.latestUpdatedCollections.update((v) => ({
          items: [...(v?.items ?? []), ...result.items.map((c) => c.collection)],
          nextKey: result.nextKey,
        }));
      });
  }
}
