import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiButtonModule, TuiNotificationModule } from '@taiga-ui/core';
import { Film, Review } from '../../../../shared/types';

@Component({
  selector: 'app-review-conflicts',
  standalone: true,
  imports: [TuiNotificationModule, TuiButtonModule],
  templateUrl: './review-conflicts.component.html',
  styleUrl: './review-conflicts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewConflictsComponent {
  @Input() reviews: Review[] = [];

  // TODO can move somewhere else (in modal for example)
  groupReviews(reviews: Review[]): Map<Film, Review[]> {
    const map = new Map<Film, Review[]>();

    for (const review of reviews) {
      const reviewsOnFilm = map.get(review.film);

      if (reviewsOnFilm) {
        map.set(review.film, [...reviewsOnFilm, review]);
      } else {
        map.set(review.film, [review]);
      }
    }

    return map;
  }
}
