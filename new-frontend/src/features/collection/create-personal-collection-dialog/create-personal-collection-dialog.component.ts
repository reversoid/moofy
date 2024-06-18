import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  CollectionDto,
  CollectionFormComponent,
} from '../collection-form/collection-form.component';

import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { Collection } from '../../../shared/types';

@Component({
  selector: 'app-create-personal-collection-dialog',
  standalone: true,
  imports: [CollectionFormComponent],
  templateUrl: './create-personal-collection-dialog.component.html',
  styleUrl: './create-personal-collection-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePersonalCollectionDialogComponent {
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<
      Pick<Collection, 'name' | 'description' | 'imageUrl'>
    >,
  ) {}

  loading = false;

  submitForm({ description, imageUrl, name }: CollectionDto) {
    this.context.completeWith({ name, description, imageUrl });
  }
}
