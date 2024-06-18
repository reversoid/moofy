import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiDestroyService, TuiMapperPipeModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDialogContext,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiElasticContainerModule,
  TuiInputModule,
  TuiRatingModule,
  TuiTagModule,
  TuiTextareaModule,
} from '@taiga-ui/kit';
import { debounceTime, filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs';
import { Collection, Film, Review } from '../../../../shared/types';
import { FilmService } from '../../../film/film.service';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { ReviewService } from '../../utils/review.service';
import { ReviewFormComponent } from '../ui/review-form/review-form.component';

@Component({
  selector: 'app-edit-review-dialog',
  standalone: true,
  imports: [
    TuiInputModule,
    TuiTextfieldControllerModule,
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
    ReactiveFormsModule,
    FormsModule,
    TuiLoaderModule,
    TuiTagModule,
    TuiMapperPipeModule,
    ReviewFormComponent,
  ],
  templateUrl: './create-review-dialog.component.html',
  styleUrl: './create-review-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class CreateReviewDialogComponent implements OnInit {
  constructor(
    private readonly fb: FormBuilder,
    private readonly destroy$: TuiDestroyService,
    private readonly filmService: FilmService,
    private readonly reviewService: ReviewService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<Review, { collectionId: Collection['id'] }>,
  ) {}

  filmNameControl = this.fb.control('');

  reviewForm = this.fb.group({
    score: this.fb.control(null),
    description: this.fb.control(null),
  });

  films = signal<Film[] | null>(null);

  searching = signal(false);

  creatingReview = signal(false);

  showDataList = signal(true);

  selectedFilm: Film | null = null;

  select(film: Film) {
    this.selectedFilm = film;
  }

  ngOnInit(): void {
    this.filmNameControl.valueChanges
      .pipe(
        tap((value) => {
          if (!value) {
            this.films.set(null);
            this.showDataList.set(false);
          } else {
            this.showDataList.set(true);
          }
        }),
        filter(Boolean),
        tap(() => this.searching.set(true)),
        debounceTime(200),
        switchMap((value) =>
          this.filmService
            .searchFilms(value ?? '', 5)
            .pipe(finalize(() => this.searching.set(false))),
        ),
        map((v) => v.items),
        takeUntil(this.destroy$),
      )
      .subscribe((v) => {
        this.films.set(v);
      });
  }

  readonly toString = (value: number) => String(value);

  createReview(data: { score: number | null; description: string | null }) {
    const filmId = this.selectedFilm?.id;
    const collectionId = this.context.data.collectionId;
    const { description, score } = data;

    if (!filmId || !collectionId) {
      return;
    }

    this.creatingReview.set(true);

    return this.reviewService
      .createReview({
        filmId,
        collectionId,
        description,
        score,
      })
      .pipe(
        finalize(() => this.creatingReview.set(false)),
        takeUntil(this.destroy$),
      )
      .subscribe((r) => this.context.completeWith(r));
  }
}
