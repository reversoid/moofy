import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiButtonModule,
  TuiDialogService,
  TuiLabelModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { CollectionComponent } from '../../entities/collection/collection.component';
import { CollectionGridComponent } from '../../widgets/collection-grid/collection-grid.component';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { CollectionWithInfo } from '../../shared/types';
import { CreateCollectionDialogComponent } from '../../features/collection/create-collection-dialog/create-collection-dialog.component';
import { CollectionService } from '../../features/collection/utils/collection.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { map, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/store';
import { selectAllUserCollections, userCollectionsActions } from '../../entities/user-collections';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-collection-page',
  standalone: true,
  imports: [
    CollectionComponent,
    TuiInputModule,
    TuiLabelModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    FormsModule,
    CollectionGridComponent,
    TuiButtonModule,
    AsyncPipe,
  ],
  templateUrl: './my-collections-page.component.html',
  styleUrl: './my-collections-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class MyCollectionsPageComponent implements OnInit {
  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly collectionService: CollectionService,
    private readonly destroy$: TuiDestroyService,
    private readonly store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.collectionService
      .getCollections()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.store.dispatch(userCollectionsActions.set({ collections: data.items }));
      });
  }

  collections$ = this.store
    .select(selectAllUserCollections)
    .pipe(map((v) => v.map((c) => c.collection)));

  search = new FormControl<string>('');

  openCreateCollectionModal() {
    this.dialogService
      .open<CollectionWithInfo>(new PolymorpheusComponent(CreateCollectionDialogComponent), {
        label: 'Создать коллекцию',
        size: 's',
      })
      .subscribe((collection) => this.store.dispatch(userCollectionsActions.add({ collection })));
  }
}
