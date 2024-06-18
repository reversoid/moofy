import { AsyncPipe, NgIf, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Data, RouterModule } from '@angular/router';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDialogService,
  TuiHintModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { combineLatestWith, finalize, map, switchMap, take, takeUntil, tap } from 'rxjs';
import { CollectionService } from '../../features/collection/utils/collection.service';
import { CreateReviewDialogComponent } from '../../features/review/review-dialog/create-review-dialog/create-review-dialog.component';
import { CollectionWithInfo, PaginatedData, Review } from '../../shared/types';
import { ReviewListComponent } from '../../widgets/review-list/review-list.component';
import { CreatorIslandComponent } from './ui/creator-island/creator-island.component';
import { DescriptionIslandComponent } from './ui/description-island/description-island.component';
import { EmptyCollectionPlaceholderComponent } from './ui/empty-collection-placeholder/empty-collection-placeholder.component';
import { ImageIslandComponent } from './ui/image-island/image-island.component';
import { ReviewConflictsBlockComponent } from './ui/review-conflicts-block/review-conflicts-block.component';
import { StatsIslandComponent } from './ui/stats-island/stats-island.component';
import { UpdatedIslandComponent } from './ui/updated-island/updated-island.component';
import { CollectionPageStore } from './utils/collection-page.store';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/store';
import { selectCurrentUser } from '../../entities/current-user/selectors';
import { CollectionInfoDialogComponent } from './ui/collection-info-dialog/collection-info-dialog.component';

@Component({
  selector: 'app-collection-page',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiTextfieldControllerModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputModule,
    RouterModule,
    TuiButtonModule,
    CreatorIslandComponent,
    DescriptionIslandComponent,
    ImageIslandComponent,
    StatsIslandComponent,
    UpdatedIslandComponent,
    ReviewListComponent,
    ReviewConflictsBlockComponent,
    EmptyCollectionPlaceholderComponent,
    NgIf,
    TuiSvgModule,
    TuiHintModule,
  ],
  templateUrl: './collection-page.component.html',
  styleUrl: './collection-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CollectionPageStore],
})
export class CollectionPageComponent {
  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly httpClient: HttpClient,
    private readonly activatedRoute: ActivatedRoute,
    private readonly destroy$: TuiDestroyService,
    private readonly collectionPageStore: CollectionPageStore,
    private readonly collectionService: CollectionService,
    private readonly store: Store<AppState>,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
  ) {
    this.initializeStore();
    this.viewCollection();
  }

  search = new FormControl<string>('');

  response = this.httpClient.get<{ ok: boolean }>('profile').pipe(map((v) => v));

  readonly isPersonal$ = this.activatedRoute.data.pipe(map((v) => Boolean(v['isPersonal'])));

  showInfoAboutCollection() {
    this.collection$
      .pipe(
        switchMap((collection) =>
          this.dialogService.open(new PolymorpheusComponent(CollectionInfoDialogComponent), {
            label: 'О коллекции',
            data: {
              collection,
            },
          }),
        ),
      )
      .subscribe();
  }

  createReview() {
    this.collection$
      .pipe(
        switchMap((collection) =>
          this.dialogService.open<Review>(new PolymorpheusComponent(CreateReviewDialogComponent), {
            label: 'Добавить обзор',
            size: 's',
            data: { collectionId: collection.id },
          }),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((review) => {
        this.collectionPageStore.addNewReview(review);
      });
  }

  private initializeStore() {
    this.collectionData$.pipe(take(1), takeUntil(this.destroy$)).subscribe((v) =>
      this.collectionPageStore.setState({
        collectionData: {
          collection: v.collection,
          additionalInfo: v.additionalInfo,
          socialStats: v.socialStats,
        },
        reviews: v.reviews,
      }),
    );
  }

  private viewCollection() {
    if (isPlatformBrowser(this.platformId)) {
      this.collection$
        .pipe(
          switchMap(({ id }) => this.collectionService.viewCollection(id)),
          takeUntil(this.destroy$),
        )
        .subscribe();
    }
  }

  private collectionData$ = this.activatedRoute.data.pipe(
    map<Data, CollectionWithInfo & { reviews: PaginatedData<Review> }>(
      (data) => data['collectionPageData'],
    ),
  );

  collection$ = this.collectionPageStore.collection$;

  collectionName$ = this.collectionPageStore.collectionName$;

  description$ = this.collectionPageStore.description$;

  creator$ = this.collectionPageStore.creator$;

  updatedAt$ = this.collectionPageStore.updatedAt$;

  imageUrl$ = this.collectionPageStore.imageUrl$;

  stats$ = this.collectionPageStore.stats$;

  reviews$ = this.collectionPageStore.reviews$;

  isPrivate$ = this.collection$.pipe(map((c) => !c.isPublic));

  reviewsExist$ = this.reviews$.pipe(
    map((r) => r.items.length > 0),
    tap((reviewsExist) => {
      if (reviewsExist) {
        this.search.enable();
      } else {
        this.search.disable();
      }
    }),
  );

  refreshingReviews = signal(false);

  loadingMoreReviews = signal(false);

  private loadReviews(nextKey?: string | null) {
    return this.collection$.pipe(
      switchMap(({ id }) => this.collectionService.getReviews(id, nextKey)),
    );
  }

  loadMoreReviews(nextKey: string) {
    this.loadingMoreReviews.set(true);
    this.loadReviews(nextKey)
      .pipe(
        finalize(() => this.loadingMoreReviews.set(false)),
        takeUntil(this.destroy$),
      )
      .subscribe((paginatedReviews) => {
        this.collectionPageStore.appendReviews(paginatedReviews);
      });
  }

  private isOwner$ = this.creator$
    .pipe(combineLatestWith(this.store.select(selectCurrentUser)))
    .pipe(map(([creator, currentUser]) => creator.id === currentUser?.id));

  showConflictsBlock$ = this.isOwner$
    .pipe(combineLatestWith(this.isPersonal$))
    .pipe(map(([isOwner, isPersonal]) => isOwner && isPersonal));

  refreshReviews() {
    this.refreshingReviews.set(true);
    this.loadReviews()
      .pipe(finalize(() => this.refreshingReviews.set(false)))
      .subscribe((reviews) => {
        this.collectionPageStore.patchState({ reviews });
      });
  }
}
