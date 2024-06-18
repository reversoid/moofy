import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDialogContext, TuiLoaderModule } from '@taiga-ui/core';
import { TuiElasticContainerModule } from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { finalize, takeUntil } from 'rxjs';
import { Film, Review } from '../../../../shared/types';
import { ReviewService } from '../../utils/review.service';
import { ReviewFormComponent } from '../ui/review-form/review-form.component';

@Component({
  selector: 'app-edit-review-dialog',
  standalone: true,
  imports: [
    TuiButtonModule,
    TuiElasticContainerModule,
    NgOptimizedImage,
    TuiLoaderModule,
    ReviewFormComponent,
  ],
  templateUrl: './edit-review-dialog.component.html',
  styleUrl: './edit-review-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class EditReviewDialogComponent {
  constructor(
    private readonly destroy$: TuiDestroyService,
    private readonly reviewService: ReviewService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<Review, { review: Review }>,
  ) {}

  selectedFilm: Film = this.context.data.review.film;

  review = this.context.data.review;

  editingReview = signal(false);

  readonly numberToString = (value: number) => String(value);

  editReview(data: { score: number | null; description: string | null }) {
    const { description, score } = data;

    const reviewId = this.context.data.review.id;

    this.editingReview.set(true);

    return this.reviewService
      .editReview(reviewId, {
        description,
        score,
      })
      .pipe(
        finalize(() => this.editingReview.set(false)),
        takeUntil(this.destroy$),
      )
      .subscribe(({ review }) => this.context.completeWith(review));
  }
}
