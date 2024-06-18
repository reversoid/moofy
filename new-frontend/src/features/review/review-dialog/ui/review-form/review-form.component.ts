import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiRatingModule, TuiTagModule, TuiTextareaModule } from '@taiga-ui/kit';
import { Film, Review } from '../../../../../shared/types';
import { TuiMapperPipeModule } from '@taiga-ui/cdk';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    TuiTagModule,
    TuiTextareaModule,
    TuiTextfieldControllerModule,
    NgOptimizedImage,
    TuiRatingModule,
    FormsModule,
    ReactiveFormsModule,
    TuiMapperPipeModule,
  ],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewFormComponent implements OnInit {
  constructor(private readonly fb: FormBuilder) {}

  @Input({ required: true }) formId!: string;

  @Input({ required: true }) film!: Film;

  @Input() review?: Review;

  @Output() reviewSubmit = new EventEmitter<{
    score: number | null;
    description: string | null;
  }>();

  ngOnInit(): void {
    if (!this.review) {
      return;
    }

    this.reviewForm.setValue({
      description: this.review.description,
      score: this.review.score,
    });
  }

  reviewForm = this.fb.group({
    score: this.fb.control<number | null>(null),
    description: this.fb.control<string | null>(null),
  });

  submitForm() {
    const { description, score } = this.reviewForm.value;

    this.reviewSubmit.emit({ description: description || null, score: score || null });
  }

  readonly toString = (value: number) => String(value);
}
