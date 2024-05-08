import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButtonModule, TuiDialogService, TuiNotificationModule } from '@taiga-ui/core';
import { Review } from '../../../../shared/types';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { ReviewConflictsDialogComponent } from '../review-conflicts-dialog/review-conflicts-dialog.component';
import { PersonalCollectionService } from '../../../../features/personal-collection/personal-collection.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-review-conflicts-block',
  standalone: true,
  imports: [TuiNotificationModule, TuiButtonModule, NgIf, AsyncPipe],
  templateUrl: './review-conflicts-block.component.html',
  styleUrl: './review-conflicts-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewConflictsBlockComponent {
  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly personalCollectionService: PersonalCollectionService,
  ) {}

  conflicts$ = this.personalCollectionService
    .getPersonalCollectionConficts()
    .pipe(map((r) => r.conflicts));

  openConflictsDialog(conflicts: Review[]) {
    this.dialogService
      .open(new PolymorpheusComponent(ReviewConflictsDialogComponent), {
        label: 'Конфликты',
        size: 'l',
        data: conflicts,
      })
      .subscribe();
  }
}
