import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { PersonalCollectionData } from '../../new-personal-collection-page.component';
import { TuiIslandModule, TuiRadioListModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';
import { NgClass } from '@angular/common';

type CombineOptions = Pick<
  NonNullable<PersonalCollectionData['combineOptions']>,
  'actionAfterMerging' | 'collectionIdsToCombine'
>;

@Component({
  selector: 'app-select-combine-options-step',
  standalone: true,
  imports: [TuiRadioListModule, TuiButtonModule, TuiIslandModule, NgClass],
  templateUrl: './select-combine-options-step.component.html',
  styleUrl: './select-combine-options-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCombineOptionsStepComponent {
  @Output() completed = new EventEmitter<CombineOptions>();

  items = [
    {
      name: 'Сохранять',
      description: 'Все коллекции будут сохранены',
      mood: 'positive',
    },

    {
      name: 'Удалить пустые',
      description: 'Если после переноса обзоров, останутся пустые коллекции, то они будут удалены',
      mood: 'negative',
    },

    {
      name: 'Удалить все',
      description: 'Все объединенные коллекции будут удалены',
      mood: 'negative',
    },
  ];

  reviewOptions = [
    {
      name: 'Скопировать',
      description: 'Обзоры останутся в коллекциях',
      mood: 'neutral',
    },

    {
      name: 'Перенести',
      description: 'Обзоры будут перенесены из коллекций',
      mood: 'neutral',
    },
  ];

  whatReviews = [
    {
      name: 'Все с описанием',
      description: 'Все обзоры с описанием будут участвовать в объединении',
      mood: 'neutral',
    },

    {
      name: 'Все с оценкой и описанием',
      description: 'Все обзоры с оценкой и описанием будут участвовать в объединении',
      mood: 'neutral',
    },
  ];
}
