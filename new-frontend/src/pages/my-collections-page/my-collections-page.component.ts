import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiButtonModule,
  TuiDialogService,
  TuiLabelModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { CollectionGridComponent } from '../../widgets/collection-grid/collection-grid.component';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { CollectionWithInfo, PaginatedData } from '../../shared/types';
import { CreateCollectionDialogComponent } from '../../features/collection/create-collection-dialog/create-collection-dialog.component';
import { CollectionService } from '../../features/collection/utils/collection.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { finalize, map, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/store';
import { selectAllUserCollections, userCollectionsActions } from '../../entities/user-collections';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-collection-page',
  standalone: true,
  imports: [
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
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(
        map((data) => data['collections'] as PaginatedData<CollectionWithInfo>),
        takeUntil(this.destroy$),
      )
      .subscribe((collections) => {
        this.store.dispatch(userCollectionsActions.set({ collections: collections.items }));
        this.loadMoreKey.set(collections.nextKey);
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

  loading = signal(false);

  loadMoreKey = signal<string | null>(null);

  loadMoreCollections(key: string) {
    this.loading.set(true);
    this.collectionService
      .getCollections(key)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntil(this.destroy$),
      )
      .subscribe((collections) => {
        this.store.dispatch(userCollectionsActions.append({ collections: collections.items }));
        this.loadMoreKey.set(collections.nextKey);
      });
  }
}
