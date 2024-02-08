import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PersonalCollectionData } from '../../new-personal-collection-page.component';
import { TuiIslandModule, TuiRadioListModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';
import { NgClass } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

type CombineOptions = Pick<
  NonNullable<PersonalCollectionData['combineOptions']>,
  'actionAfterMerging' | 'collectionIdsToCombine'
>;

type Option<ID> = {
  id: ID;
  name: string;
  description: string;
  mood: 'neutral' | 'positive' | 'negative';
};

@Component({
  selector: 'app-select-combine-options-step',
  standalone: true,
  imports: [
    TuiRadioListModule,
    TuiButtonModule,
    TuiIslandModule,
    NgClass,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './select-combine-options-step.component.html',
  styleUrl: './select-combine-options-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCombineOptionsStepComponent {
  constructor(private readonly fb: FormBuilder) {}

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
    reviewsToPick: this.fb.control(this.reviewsToPickOptions[0]),
    reviewsStrategy: this.fb.control(this.reviewsStrategyOptions[0]),
    collectionsStrategy: this.fb.control(this.collectionsStrategyOptions[0]),
  });

  submitForm() {
    console.log(this.form.value);
  }
}
