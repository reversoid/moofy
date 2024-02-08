import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TuiIslandModule, TuiRadioLabeledModule, TuiRadioListModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';
import { NgFor } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioContentComponent } from './radio-content/radio-content.component';
import { TuiDestroyService, TuiMapperPipeModule } from '@taiga-ui/cdk';
import { takeUntil } from 'rxjs';

type Option<ID = unknown> = {
  id: ID;
  name: string;
  description: string;
  mood: 'neutral' | 'positive' | 'negative';
  disabled?: boolean;
};

@Component({
  selector: 'app-select-combine-options-step',
  standalone: true,
  imports: [
    TuiRadioListModule,
    TuiButtonModule,
    TuiIslandModule,
    FormsModule,
    ReactiveFormsModule,
    TuiRadioLabeledModule,
    NgFor,
    RadioContentComponent,
    TuiMapperPipeModule,
  ],
  templateUrl: './select-combine-options-step.component.html',
  styleUrl: './select-combine-options-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class SelectCombineOptionsStepComponent implements OnInit {
  constructor(
    private readonly fb: FormBuilder,
    private readonly destroy$: TuiDestroyService,
  ) {}

  reviewsToPickOptions: Option<'DESC' | 'DESC_SCORE'>[] = [
    {
      id: 'DESC',
      name: 'Все с описанием',
      description: 'Все обзоры с описанием будут участвовать в объединении',
      mood: 'neutral',
    },

    {
      id: 'DESC_SCORE',
      name: 'Все с оценкой и описанием',
      description: 'Все обзоры с оценкой и описанием будут участвовать в объединении',
      mood: 'neutral',
    },
  ];

  reviewsStrategyOptions: Option<'COPY' | 'MOVE'>[] = [
    {
      id: 'COPY',
      name: 'Скопировать',
      description: 'Обзоры останутся в коллекциях',
      mood: 'positive',
    },

    {
      id: 'MOVE',
      name: 'Перенести',
      description: 'Обзоры будут перенесены из коллекций',
      mood: 'negative',
    },
  ];

  collectionsStrategyOptions: Option<'SAVE' | 'REMOVE_EMPTY' | 'REMOVE_ALL'>[] = [
    {
      id: 'SAVE',
      name: 'Сохранять',
      description: 'Все коллекции будут сохранены',
      mood: 'positive',
    },

    {
      id: 'REMOVE_EMPTY',
      name: 'Удалить пустые',
      description: 'Если после переноса обзоров останутся пустые коллекции, то они будут удалены',
      mood: 'negative',
    },

    {
      id: 'REMOVE_ALL',
      name: 'Удалить все',
      description: 'Все объединенные коллекции будут удалены',
      mood: 'negative',
    },
  ];

  form = this.fb.group({
    reviewsToPick: this.fb.control<'DESC' | 'DESC_SCORE'>('DESC'),
    reviewsStrategy: this.fb.control<'COPY' | 'MOVE'>('COPY'),
    collectionsStrategy: this.fb.control<'SAVE' | 'REMOVE_EMPTY' | 'REMOVE_ALL'>('SAVE'),
  });

  submitForm() {
    console.log(this.form.value);
  }

  ngOnInit(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((f) => {
      const cannotBeBoth = f.reviewsStrategy !== 'MOVE' && f.collectionsStrategy === 'REMOVE_EMPTY';
      if (cannotBeBoth) {
        this.form.controls.collectionsStrategy.patchValue('SAVE');
      }
    });
  }

  get isSelectedCopyReviewsStrategy() {
    return this.form.value.reviewsStrategy === 'COPY';
  }
}
