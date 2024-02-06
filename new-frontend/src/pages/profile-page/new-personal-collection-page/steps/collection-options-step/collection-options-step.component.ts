import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Collection } from '../../../../../shared/types';

@Component({
  selector: 'app-collection-options-step',
  standalone: true,
  imports: [],
  templateUrl: './collection-options-step.component.html',
  styleUrl: './collection-options-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionOptionsStepComponent {
  @Output() completed = new EventEmitter<Pick<Collection, 'name' | 'description' | 'imageUrl'>>();
}
