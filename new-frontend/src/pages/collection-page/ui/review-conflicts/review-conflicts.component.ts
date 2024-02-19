import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiButtonModule, TuiNotificationModule } from '@taiga-ui/core';
import { Review } from '../../../../shared/types';

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
}
