import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiButtonModule, TuiDialogService } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { AppState } from '../../../../app/store';
import { userCollectionsActions } from '../../../../entities/user-collections';
import { EditCollectionDialogComponent } from '../../../../features/collection/edit-collection-dialog/edit-collection-dialog.component';
import { Collection, CollectionWithInfo } from '../../../../shared/types';

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

  @Input({ required: true }) collection!: Collection | null;

  @Input({ required: true }) stats!: {
    likesAmount: number;
    commentsAmount: number;
    isLiked: boolean;
    isFavorite: boolean;
  } | null;

  openCommentsDialog() {
    this.dialogService.open('Some comments here', { label: 'Комментарии' }).subscribe();
  }

  handleLike() {
    console.log('collection liked');
  }

  handleBookmark() {
    console.log('collection bookmarked');
  }

  openOptions() {
    if (!this.collection) {
      return;
    }

    this.dialogService
      .open<CollectionWithInfo>(new PolymorpheusComponent(EditCollectionDialogComponent), {
        label: 'Настройки коллекции',
        size: 's',
        data: {
          collection: this.collection satisfies Collection,

          isPersonal: this.isPersonal,
        },
      })
      .subscribe((collection) => {
        this.store.dispatch(userCollectionsActions.update({ collection }));
      });
  }
}
