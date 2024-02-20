import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiButtonModule, TuiDialogService, TuiNotificationModule } from '@taiga-ui/core';
import { Review } from '../../../../shared/types';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { ReviewConflictsDialogComponent } from '../review-conflicts-dialog/review-conflicts-dialog.component';

@Component({
  selector: 'app-review-conflicts-block',
  standalone: true,
  imports: [TuiNotificationModule, TuiButtonModule],
  templateUrl: './review-conflicts-block.component.html',
  styleUrl: './review-conflicts-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewConflictsBlockComponent {
  constructor(private readonly dialogService: TuiDialogService) {}

  @Input() reviews: Review[] = [];

  openConflictsDialog() {
    this.dialogService
      .open(new PolymorpheusComponent(ReviewConflictsDialogComponent), {
        label: 'Конфликты',
        size: 'l',
        data: this.reviews,
      })
      .subscribe();
  }
}
