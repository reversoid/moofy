import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiButtonModule, TuiDialogService } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { EditCollectionDialogComponent } from '../../../../features/collection/edit-collection-dialog/edit-collection-dialog.component';
import { CollectionDto } from '../../../../features/collection/collection-form/collection-form.component';
import { CollectionWithInfo } from '../../../../shared/types';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app/store';
import { userCollectionsActions } from '../../../../entities/user-collections';

@Component({
  selector: 'app-stats-island',
  standalone: true,
  imports: [TuiIslandModule, TuiButtonModule],
  templateUrl: './stats-island.component.html',
  styleUrl: './stats-island.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsIslandComponent {
  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly store: Store<AppState>,
  ) {}

  @Input() isPersonal = false;

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
        label: 'Настройки коллекции',
        size: 's',
        data: {
          collection: {
            description: 'some desc',
            imageUrl: null,
            isPrivate: false,
            name: 'Some name',
          } satisfies CollectionDto,

          isPersonal: this.isPersonal,
        },
      })
      .subscribe((collection) => {
        this.store.dispatch(userCollectionsActions.update({ collection }));
      });
  }
}
