import { AsyncPipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Data, RouterModule } from '@angular/router';
import { TuiButtonModule, TuiDialogService, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { map } from 'rxjs';
import { CollectionWithInfo, PaginatedData, Review } from '../../shared/types';
import { ReviewListComponent } from '../../widgets/review-list/review-list.component';
import { CreateReviewDialogComponent } from '../../features/review/create-review-dialog/create-review-dialog.component';
import { CreatorIslandComponent } from './ui/creator-island/creator-island.component';
import { DescriptionIslandComponent } from './ui/description-island/description-island.component';
import { ImageIslandComponent } from './ui/image-island/image-island.component';
import { ReviewConflictsBlockComponent } from './ui/review-conflicts-block/review-conflicts-block.component';
import { StatsIslandComponent } from './ui/stats-island/stats-island.component';
import { UpdatedIslandComponent } from './ui/updated-island/updated-island.component';
import dayjs from 'dayjs';
import { EmptyCollectionPlaceholderComponent } from './ui/empty-collection-placeholder/empty-collection-placeholder.component';

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
})
export class CollectionPageComponent {
  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly httpClient: HttpClient,
    private readonly injector: Injector,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  search = new FormControl<string>('');

  response = this.httpClient.get<{ ok: boolean }>('profile').pipe(map((v) => v));

  readonly isPersonal$ = this.activatedRoute.data.pipe(map((v) => Boolean(v['isPersonal'])));

  showInfoAboutCollection() {
    this.dialogService.open('Some modal here', { label: 'О коллекции' }).subscribe();
  }

  createReview() {
    this.dialogService
      .open(new PolymorpheusComponent(CreateReviewDialogComponent), {
        label: 'Добавить фильм',
        size: 's',
      })
      .subscribe();
  }

  private collectionData$ = this.activatedRoute.data.pipe(
    map<Data, CollectionWithInfo & { reviews: PaginatedData<Review> }>(
      (data) => data['collectionPageData'],
    ),
  );

  collectionId$ = this.collectionData$.pipe(map((c) => c.collection.id));

  collectionName$ = this.collectionData$.pipe(map((c) => c.collection.name));

  description$ = this.collectionData$.pipe(map((c) => c.collection.description));

  creator$ = this.collectionData$.pipe(map((c) => c.collection.user));

  updatedAt$ = this.collectionData$.pipe(map((c) => dayjs(c.collection.updatedAt)));

  imageUrl$ = this.collectionData$.pipe(map((c) => c.collection.imageUrl));

  stats$ = this.collectionData$.pipe(map((c) => ({ ...c.socialStats, ...c.additionalInfo })));

  reviews$ = this.collectionData$.pipe(map((c) => c.reviews));

  reviewsExist$ = this.reviews$.pipe(map((r) => r.items.length > 0));
}
