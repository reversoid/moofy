import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDialogContext,
  TuiDialogService,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT, PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { finalize, mergeMap, takeUntil } from 'rxjs';
import { Collection, CollectionWithInfo } from '../../../shared/types';
import {
  CollectionDto,
  CollectionFormComponent,
} from '../collection-form/collection-form.component';
import { DeleteCollectionConfirmDialogComponent } from '../delete-collection-confirm-dialog/delete-collection-confirm-dialog.component';
import { CollectionService } from '../utils/collection.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-collection-dialog',
  standalone: true,
  imports: [CollectionFormComponent, TuiButtonModule, TuiLoaderModule, NgIf],
  templateUrl: './edit-collection-dialog.component.html',
  styleUrl: './edit-collection-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class EditCollectionDialogComponent {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly destroy$: TuiDestroyService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<
      CollectionWithInfo | null,
      { collection: Collection; isPersonal: boolean }
    >,
    private readonly dialogService: TuiDialogService,
  ) {}

  isLoading = signal(false);

  isDeleting = signal(false);

  get existingCollection(): Collection {
    const { collection: existingCollection } = this.context.data;

    return existingCollection;
  }

  get isPersonal() {
    return this.context.data.isPersonal;
  }

  deleteCollection() {
    const collectionId = this.context.data.collection.id;
    this.dialogService
      .open(new PolymorpheusComponent(DeleteCollectionConfirmDialogComponent), {
        label: 'Удалить коллекцию?',
        size: 's',
        appearance: 'danger',
        dismissible: true,
        data: { collectionId },
      })
      .pipe(
        mergeMap(() => {
          this.isDeleting.set(true);

          return this.collectionService.deleteCollection(collectionId).pipe(
            finalize(() => {
              this.isDeleting.set(false);
            }),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.context.completeWith(null));
  }

  editCollection({ description, imageUrl, isPrivate, name }: CollectionDto) {
    const { id: collectionId } = this.context.data.collection;

    this.isLoading.set(true);

    this.collectionService
      .updateCollection({
        description,
        imageUrl,
        isPublic: !isPrivate,
        name: name!,
        id: collectionId,
      })
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((e) => {
        this.context.completeWith(e);
      });
  }
}
