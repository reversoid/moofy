import { AsyncPipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Data, RouterModule } from '@angular/router';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDialogService, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { map, switchMap, take, takeUntil } from 'rxjs';
import { CreateReviewDialogComponent } from '../../features/review/create-review-dialog/create-review-dialog.component';
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
    private readonly injector: Injector,
    private readonly activatedRoute: ActivatedRoute,
    private readonly destroy$: TuiDestroyService,
    private readonly collectionPageStore: CollectionPageStore,
  ) {
    this.initializeStore();
  }

  search = new FormControl<string>('');

  response = this.httpClient.get<{ ok: boolean }>('profile').pipe(map((v) => v));

  readonly isPersonal$ = this.activatedRoute.data.pipe(map((v) => Boolean(v['isPersonal'])));

  showInfoAboutCollection() {
    this.dialogService.open('Some modal here', { label: 'О коллекции' }).subscribe();
  }

  createReview() {
    this.collectionId$
      .pipe(
        switchMap((id) =>
          this.dialogService.open<Review>(new PolymorpheusComponent(CreateReviewDialogComponent), {
            label: 'Добавить фильм',
            size: 's',
            data: { collectionId: id },
          }),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((review) => {
        this.collectionPageStore.addReview(review);
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

  private collectionData$ = this.activatedRoute.data.pipe(
    map<Data, CollectionWithInfo & { reviews: PaginatedData<Review> }>(
      (data) => data['collectionPageData'],
    ),
  );

  collectionId$ = this.collectionPageStore.collectionId$;

  collectionName$ = this.collectionPageStore.collectionName$;

  description$ = this.collectionPageStore.description$;

  creator$ = this.collectionPageStore.creator$;

  updatedAt$ = this.collectionPageStore.updatedAt$;

  imageUrl$ = this.collectionPageStore.imageUrl$;

  stats$ = this.collectionPageStore.stats$;

  reviews$ = this.collectionPageStore.reviews$;

  reviewsExist$ = this.reviews$.pipe(map((r) => r.items.length > 0));
}
