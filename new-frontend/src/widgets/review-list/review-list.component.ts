import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ReviewComponent } from '../../entities/review/review.component';
import { NgFor, NgIf } from '@angular/common';
import { PaginatedData, Review, User } from '../../shared/types';
import { IntersectionLoaderComponent } from '../../shared/ui/intersection-loader/intersection-loader.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/store';
import { selectCurrentUser } from '../../entities/current-user/selectors';
import { TuiButtonModule, TuiDialogService } from '@taiga-ui/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs';
import { EditReviewDialogComponent } from '../../features/review/review-dialog/edit-review-dialog/edit-review-dialog.component';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [NgIf, ReviewComponent, NgFor, IntersectionLoaderComponent, TuiButtonModule],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ReviewListComponent {
  constructor(
    private readonly store: Store<AppState>,
    private readonly dialogService: TuiDialogService,
    private readonly destroy$: TuiDestroyService,
  ) {}

  @Input() loadingMore = false;

  @Input() loading = false;

  @Input() paginatedReviews?: PaginatedData<Review> | null;

  @Input() user?: User;

  @Output() loadMore = new EventEmitter<{ loadKey: string }>();

  private currentUser$ = this.store.select(selectCurrentUser);

  isCreator = true;

  handleLoadMore() {
    if (this.paginatedReviews?.nextKey) {
      this.loadMore.emit({ loadKey: this.paginatedReviews.nextKey });
    }
  }

  get showSkeleton() {
    return this.loading && !this.paginatedReviews?.items;
  }

  openEditReviewDialog(review: Review) {
    this.dialogService
      .open(new PolymorpheusComponent(EditReviewDialogComponent), {
        size: 's',
        data: { review },
        label: 'Изменить обзор',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
