import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { PersonalCollectionData } from '../../new-personal-collection-page.component';
import { TuiRadioListModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';

type CombineOptions = Pick<
  NonNullable<PersonalCollectionData['combineOptions']>,
  'actionAfterMerging' | 'collectionIdsToCombine'
>;

@Component({
  selector: 'app-select-combine-options-step',
  standalone: true,
  imports: [TuiRadioListModule, TuiButtonModule],
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
    },

    {
      name: 'Удалить пустые',
      description: 'Если после переноса обзоров, останутся пустые коллекции, то они будут удалены',
    },

    {
      name: 'Удалить все',
      description: 'Все объединенные коллекции будут удалены',
    },
  ];

  reviewOptions = [
    {
      name: 'Скопировать',
      description: 'Обзоры останутся в коллекциях',
    },

    {
      name: 'Перенести',
      description: 'Обзоры будут перенесены из коллекций',
    },
  ];

  whatReviews = [
    {
      name: 'Все с описанием',
      description: 'Все обзоры с описанием будут участвовать в объединении',
    },

    {
      name: 'Все с оценкой и описанием',
      description: 'Все обзоры с оценкой и описанием будут участвовать в объединении',
    },
  ];
}
