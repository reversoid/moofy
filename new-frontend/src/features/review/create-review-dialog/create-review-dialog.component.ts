import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiDestroyService, TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDataListModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import {
  TuiElasticContainerModule,
  TuiInputModule,
  TuiRatingModule,
  TuiTagModule,
  TuiTextareaModule,
} from '@taiga-ui/kit';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil,
} from 'rxjs';
import { Film } from '../../../shared/types';
import { FilmService } from '../../film/film.service';

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
    ReactiveFormsModule,
    FormsModule,
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
  ) {}

  filmNameControl = this.fb.control('');

  reviewForm = this.fb.group({
    score: this.fb.control(null),
    description: this.fb.control(null),
  });

  films$ = new BehaviorSubject<Film[] | null>(null);

  selectedFilm: Film | null = null;

  get filmYear() {
    return String(this.selectedFilm?.year);
  }

  select(film: Film) {
    this.selectedFilm = film;
  }

  ngOnInit(): void {
    this.filmNameControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(250),
        switchMap((value) => this.filmService.searchFilms(value ?? '')),
        map((v) => v.items),
        takeUntil(this.destroy$),
      )
      .subscribe(this.films$);
  }

  createReview() {}
}
