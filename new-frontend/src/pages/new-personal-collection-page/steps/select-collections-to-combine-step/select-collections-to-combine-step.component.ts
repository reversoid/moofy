import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiCheckboxBlockModule, TuiIslandModule } from '@taiga-ui/kit';
import { CollectionComponent } from '../../../../entities/collection/collection.component';
import { Collection } from '../../../../shared/types';
import { ActivatedRoute, Router } from '@angular/router';
import { CreatePersonalCollectionFlowService } from '../../utils/create-personal-collection-flow.service';
import { CollectionService } from '../../../../features/collection/utils/collection.service';
import { finalize, takeUntil } from 'rxjs';
import { TuiDestroyService } from '@taiga-ui/cdk';

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
    TuiIslandModule,
  ],
  templateUrl: './select-collections-to-combine-step.component.html',
  styleUrl: './select-collections-to-combine-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class SelectCollectionsToCombineStepComponent implements OnInit {
  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly flowService: CreatePersonalCollectionFlowService,
    private readonly collectionsService: CollectionService,
    private readonly destroy$: TuiDestroyService,
  ) {}

  form = this.fb.group<Record<string, boolean>>({});

  collections = signal<Collection[] | null>(null);

  loadingCollections = signal(false);

  private loadKey = signal<string | null>(null);

  get isSelectedAnyCollection() {
    return Object.values(this.form.value).some(Boolean);
  }

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections() {
    this.loadingCollections.set(true);

    this.collectionsService
      .getCollections(this.loadKey())
      .pipe(
        finalize(() => this.loadingCollections.set(false)),
        takeUntil(this.destroy$),
      )
      .subscribe(({ items, nextKey }) => {
        const collections = items.map((i) => i.collection);
        for (const collection of collections) {
          this.form.addControl(String(collection.id), this.fb.control(false));
        }

        this.loadKey.set(nextKey);
        this.collections.update((c) => [...(c ?? []), ...collections]);
      });
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
