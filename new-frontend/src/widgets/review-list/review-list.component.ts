import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ReviewComponent } from '../../entities/review/review.component';
import { TuiLoaderModule } from '@taiga-ui/core';
import { NgFor, NgIf } from '@angular/common';
import { PaginatedData, Review } from '../../shared/types';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [NgIf, ReviewComponent, TuiLoaderModule, NgFor],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewListComponent {
  loading = true;

  @Input() reviews?: PaginatedData<Review> | null;

  @Output() loadMore = new EventEmitter<{ loadKey: string }>();

  handleLoadMore() {
    if (this.reviews?.nextKey) {
      this.loadMore.emit({ loadKey: this.reviews.nextKey });
    }
  }
}
