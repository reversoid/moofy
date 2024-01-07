import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReviewComponent } from '../../entities/review/review.component';
import { TuiLoaderModule } from '@taiga-ui/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [NgIf, ReviewComponent, TuiLoaderModule],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewListComponent {
  loading = true;
}
