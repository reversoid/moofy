import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { finalize, takeUntil } from 'rxjs';
import { CollectionWithInfo } from '../../../shared/types';
import {
  CollectionDto,
  CollectionFormComponent,
} from '../collection-form/collection-form.component';
import { CollectionService } from '../utils/collection.service';

@Component({
  selector: 'app-edit-collection-dialog',
  standalone: true,
  imports: [CollectionFormComponent],
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
      CollectionWithInfo,
      { collection: CollectionDto; isPersonal: boolean }
    >,
  ) {}

  loading = signal(false);

  get existingCollectionDto(): CollectionDto {
    const { collection: existingCollection } = this.context.data;

    return {
      description: existingCollection.description,
      imageUrl: existingCollection.imageUrl,
      isPrivate: existingCollection.isPrivate,
      name: existingCollection.name,
    };
  }

  get isPersonal() {
    return this.context.data.isPersonal;
  }

  editCollection({ description, imageUrl, isPrivate, name }: CollectionDto) {
    this.loading.set(true);

    this.collectionService
      .updateCollection({
        description,
        imageUrl,
        isPublic: !isPrivate,
        name: name!,
        id: 1,
      })
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((e) => {
        this.context.completeWith(e);
      });
  }
}
