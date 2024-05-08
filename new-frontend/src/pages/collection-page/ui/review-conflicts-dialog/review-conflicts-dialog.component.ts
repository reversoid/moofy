import { ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { TuiButtonModule, TuiDialogContext, TuiLoaderModule } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Film, Review } from '../../../../shared/types';
import { NgFor } from '@angular/common';
import { ReviewComponent } from '../../../../entities/review/review.component';
import { TuiRadioBlockModule } from '@taiga-ui/kit';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalCollectionService } from '../../../../features/personal-collection/personal-collection.service';
import { finalize, takeUntil } from 'rxjs';
import { TuiDestroyService } from '@taiga-ui/cdk';

@Component({
  selector: 'app-review-conflicts-dialog',
  standalone: true,
  imports: [
    NgFor,
    ReviewComponent,
    TuiRadioBlockModule,
    TuiButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiLoaderModule,
  ],
  templateUrl: './review-conflicts-dialog.component.html',
  styleUrl: './review-conflicts-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ReviewConflictsDialogComponent implements OnInit {
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, Review[]>,
    private readonly fb: FormBuilder,
    private readonly personalCollectionService: PersonalCollectionService,
    private readonly destroy$: TuiDestroyService,
  ) {
    this.control.valueChanges.subscribe(console.log);
  }

  resolvedConflictsForm = this.fb.group({});

  control = new FormControl('someValue');

  reviews = this.context.data;

  groups = this.groupReviewsByFilm(this.reviews);

  ngOnInit(): void {
    for (const group of this.groups) {
      this.resolvedConflictsForm.addControl(
        group.film.id,
        this.fb.control<Review['id'] | null>(null),
      );
    }
  }

  groupReviewsByFilm(reviews: Review[]): { film: Film; reviews: Review[] }[] {
    const groups = this.groupReviewsByFilmId(reviews);
    const films = this.getFilmsMap(reviews);

    return Array.from(groups).map(([filmId, reviewsOnFilm]) => ({
      film: films.get(filmId)!,
      reviews: reviewsOnFilm,
    }));
  }

  private groupReviewsByFilmId(reviews: Review[]): Map<Film['id'], Review[]> {
    const map = new Map<Film['id'], Review[]>();

    for (const review of reviews) {
      const reviewsOnFilm = map.get(review.film.id);

      map.set(review.film.id, [...(reviewsOnFilm ?? []), review]);
    }

    return map;
  }

  private getFilmsMap(reviews: Review[]): Map<Film['id'], Film> {
    const map = new Map<Film['id'], Film>();

    for (const review of reviews) {
      const film = review.film;

      if (!map.has(film.id)) {
        map.set(film.id, film);
      }
    }

    return map;
  }

  get isConfirmDisabled() {
    return !Object.values(this.resolvedConflictsForm.value).every(
      (v) => v !== null && v !== undefined,
    );
  }

  resolveConflicts() {
    if (this.isConfirmDisabled) {
      return;
    }

    this.loading.set(true);

    this.personalCollectionService
      .resolvePersonalCollectionConficts(Object.values(this.resolvedConflictsForm.value))
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.context.completeWith();
      });
  }

  loading = signal(false);
}
