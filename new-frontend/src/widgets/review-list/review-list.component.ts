import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewListComponent {

}
