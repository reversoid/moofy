import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButtonModule, TuiDialogService } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { EditCollectionDialogComponent } from '../../../../features/collection/edit-collection-dialog/edit-collection-dialog.component';
import { CollectionDto } from '../../../../features/collection/collection-form/collection-form.component';
import { CollectionWithInfo } from '../../../../shared/types';

@Component({
  selector: 'app-stats-island',
  standalone: true,
  imports: [TuiIslandModule, TuiButtonModule],
  templateUrl: './stats-island.component.html',
  styleUrl: './stats-island.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsIslandComponent {
  constructor(private readonly dialogService: TuiDialogService) {}

  openCommentsDialog() {
    this.dialogService.open('Some comments here', { label: 'Комментарии' }).subscribe();
  }

  handleLike() {
    console.log('collection liked');
  }

  handleBookmark() {
    console.log('collection bookmarked');
  }

  handleOptions() {
    this.dialogService
      .open<CollectionWithInfo>(new PolymorpheusComponent(EditCollectionDialogComponent), {
        label: 'Обновить коллекцию',
        size: 's',
        data: {
          description: 'some desc',
          imageUrl: null,
          isPrivate: false,
          name: 'Some name',
        } satisfies CollectionDto,
      })
      .subscribe();
  }
}
