import { NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiLinkModule } from '@taiga-ui/core';
import { TuiIslandModule, TuiTagModule } from '@taiga-ui/kit';
import { Review } from '../../shared/types';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [TuiIslandModule, TuiTagModule, TuiLinkModule, NgOptimizedImage, NgIf],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewComponent {
  @Input() review?: Review;

  get filmYear() {
    return this.review?.film.year ? String(this.review?.film.year) : null;
  }
}
