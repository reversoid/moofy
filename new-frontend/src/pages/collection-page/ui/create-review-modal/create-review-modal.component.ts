import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDataListModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import {
  TuiElasticContainerModule,
  TuiInputModule,
  TuiRatingModule,
  TuiTextareaModule,
} from '@taiga-ui/kit';
import { of } from 'rxjs';

enum CreateReviewSteps {
  selectFilm,
  scoreAndDescription,
}

// TODO make it lazy routable
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
  ],
  templateUrl: './create-review-modal.component.html',
  styleUrl: './create-review-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReviewModalComponent {
  users$ = of([{ username: 'aboba' }, { username: 'grenka' }, { username: 'floppa' }]);

  user: any;

  get content(): any {
    return this.user?.username;
  }

  select(user: any) {
    this.user = user;
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
