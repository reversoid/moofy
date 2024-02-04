import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs';
import { CollectionWithInfo } from '../../../shared/types';
import {
  CollectionDto,
  CollectionFormComponent,
} from '../collection-form/collection-form.component';
import { CollectionService } from '../utils/collection.service';

@Component({
  selector: 'app-create-collection-dialog',
  standalone: true,
  imports: [CollectionFormComponent],
  templateUrl: './create-collection-dialog.component.html',
  styleUrl: './create-collection-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCollectionDialogComponent {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly destroy$: TuiDestroyService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<CollectionWithInfo>,
  ) {}

  createCollection({ description, imageUrl, isPrivate, name }: CollectionDto) {
    this.collectionService
      .createCollection({
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
