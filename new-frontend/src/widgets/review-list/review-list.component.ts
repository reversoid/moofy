import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ReviewComponent } from '../../entities/review/review.component';
import { NgFor, NgIf } from '@angular/common';
import { PaginatedData, Review } from '../../shared/types';
import { IntersectionLoaderComponent } from '../../shared/ui/intersection-loader/intersection-loader.component';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [NgIf, ReviewComponent, NgFor, IntersectionLoaderComponent],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewListComponent {
  @Input() loadingMore = false;

  @Input() loading = false;

  @Input() paginatedReviews?: PaginatedData<Review> | null;

  @Output() loadMore = new EventEmitter<{ loadKey: string }>();

  handleLoadMore() {
    if (this.paginatedReviews?.nextKey) {
      this.loadMore.emit({ loadKey: this.paginatedReviews.nextKey });
    }
  }

  get showSkeleton() {
    return this.loading && !this.paginatedReviews?.items;
  }
}
