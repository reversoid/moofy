import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiButtonModule, TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Review } from '../../../../shared/types';
import { ConflictingReviewsPipe } from './conflicting-reviews-pipe';
import { NgFor } from '@angular/common';
import { ReviewComponent } from '../../../../entities/review/review.component';
import { TuiRadioBlockModule } from '@taiga-ui/kit';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-conflicts-dialog',
  standalone: true,
  imports: [
    ConflictingReviewsPipe,
    NgFor,
    ReviewComponent,
    TuiRadioBlockModule,
    TuiButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './review-conflicts-dialog.component.html',
  styleUrl: './review-conflicts-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewConflictsDialogComponent {
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, Review[]>,
  ) {
    this.control.valueChanges.subscribe(console.log);
  }

  control = new FormControl('someValue');

  reviews = this.context.data;
}
