import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiCheckboxBlockModule } from '@taiga-ui/kit';
import { CollectionComponent } from '../../../../entities/collection/collection.component';
import { Collection } from '../../../../shared/types';
import { collectionMock } from '../../../../widgets/collection-grid/collection-grid.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CreatePersonalCollectionFlowService } from '../../utils/create-personal-collection-flow.service';

@Component({
  selector: 'app-select-collections-to-combine-step',
  standalone: true,
  imports: [
    CollectionComponent,
    TuiButtonModule,
    NgIf,
    TuiCheckboxBlockModule,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
  ],
  templateUrl: './select-collections-to-combine-step.component.html',
  styleUrl: './select-collections-to-combine-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCollectionsToCombineStepComponent implements OnInit {
  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly flowService: CreatePersonalCollectionFlowService,
  ) {}

  form = this.fb.group<Record<string, boolean>>({});

  collections: Collection[] = [collectionMock];

  get isSelectedAnyCollection() {
    return Object.values(this.form.value).some(Boolean);
  }

  ngOnInit(): void {
    for (const collection of this.collections) {
      this.form.addControl(String(collection.id), this.fb.control(false));
    }
  }

  handleFormSubmit() {
    const selectedIds = this.getSelectedCollectionIds();
    if (!selectedIds) {
      return;
    }

    this.flowService.completeStep({
      type: 'collectionIdsToMerge',
      payload: selectedIds,
    });

    this.router.navigate(['..', 'combine-options'], { relativeTo: this.route });
  }

  private getSelectedCollectionIds(): Array<Collection['id']> {
    const collections = this.form.value;

    return Object.entries(collections)
      .filter(([, selected]) => selected)
      .map(([id]) => Number(id));
  }
}
