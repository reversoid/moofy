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
  selector: 'app-create-review-modal',
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
  templateUrl: './create-review-modal.component.html',
  styleUrl: './create-review-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReviewModalComponent {
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
