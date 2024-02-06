import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-select-collections-to-combine-step',
  standalone: true,
  imports: [],
  templateUrl: './select-collections-to-combine-step.component.html',
  styleUrl: './select-collections-to-combine-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCollectionsToCombineStepComponent {
  @Output() completed = new EventEmitter<number[]>();

  selectedCollectionsIds = [];

  handleSubmitSelectedCollections() {
    this.completed.emit(this.selectedCollectionsIds);
  }
}
