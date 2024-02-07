import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CollectionComponent } from '../../../../../entities/collection/collection.component';
import { Collection } from '../../../../../shared/types';
import { collectionMock } from '../../../../../widgets/collection-grid/collection-grid.component';
import { TuiCheckboxBlockModule, TuiCheckboxModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-select-collections-to-combine-step',
  standalone: true,
  imports: [
    CollectionComponent,
    TuiCheckboxModule,
    TuiButtonModule,
    NgClass,
    NgIf,
    RouterLink,
    TuiCheckboxBlockModule,
  ],
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

  collection: Collection = collectionMock;

  isSelected = true;
}
