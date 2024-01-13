import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDataListModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import {
  TuiElasticContainerModule,
  TuiInputModule,
  TuiRatingModule,
  TuiTagModule,
  TuiTextareaModule,
} from '@taiga-ui/kit';
import { of } from 'rxjs';

@Component({
  selector: 'app-create-review-dialog',
  standalone: true,
  imports: [
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiLetModule,
    NgIf,
    TuiDataListModule,
    AsyncPipe,
    NgForOf,
    TuiButtonModule,
    TuiElasticContainerModule,
    TuiTextareaModule,
    TuiRatingModule,
    NgOptimizedImage,
    TuiTagModule,
  ],
  templateUrl: './create-review-dialog.component.html',
  styleUrl: './create-review-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReviewDialogComponent {
  films$ = of([{ name: 'aboba' }, { name: 'grenka' }, { name: 'floppa' }]);

  film: any;

  get content(): any {
    return this.film?.name;
  }

  select(film: any) {
    this.film = film;
  }

  createReview() {}
}
