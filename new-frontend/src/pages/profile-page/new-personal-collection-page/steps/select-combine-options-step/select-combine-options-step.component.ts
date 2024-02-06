import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { PersonalCollectionData } from '../../new-personal-collection-page.component';

type CombineOptions = Pick<
  NonNullable<PersonalCollectionData['combineOptions']>,
  'actionAfterMerging' | 'collectionIdsToCombine'
>;

@Component({
  selector: 'app-select-combine-options-step',
  standalone: true,
  imports: [],
  templateUrl: './select-combine-options-step.component.html',
  styleUrl: './select-combine-options-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCombineOptionsStepComponent {
  @Output() completed = new EventEmitter<CombineOptions>();
}
