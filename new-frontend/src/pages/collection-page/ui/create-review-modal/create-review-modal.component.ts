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

enum CreateReviewSteps {
  selectFilm,
  scoreAndDescription,
}

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

  step: CreateReviewSteps = CreateReviewSteps.selectFilm;

  get isSelectFilmStep() {
    return this.step === CreateReviewSteps.selectFilm;
  }

  get isScoreAndDescriptionStep() {
    return this.step === CreateReviewSteps.scoreAndDescription;
  }

  finishSelectFilmStep() {
    this.step = CreateReviewSteps.scoreAndDescription;
  }

  createReview() {}
}
