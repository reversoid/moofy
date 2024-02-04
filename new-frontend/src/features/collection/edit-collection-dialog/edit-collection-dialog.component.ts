import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs';
import { Collection, CollectionWithInfo } from '../../../shared/types';
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
})
export class EditCollectionDialogComponent {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly destroy$: TuiDestroyService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<CollectionWithInfo, Collection>,
  ) {}

  get existingCollectionDto(): CollectionDto {
    const existingCollection = this.context.data;

    return {
      description: existingCollection.description,
      imageUrl: existingCollection.imageUrl,
      isPrivate: !existingCollection.isPublic,
      name: existingCollection.name,
    };
  }

  editCollection({ description, imageUrl, isPrivate, name }: CollectionDto) {
    this.collectionService
      .updateCollection({
        description,
        imageUrl,
        isPublic: !isPrivate,
        name: name!,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => {
        this.context.completeWith(e);
      });
  }
}
