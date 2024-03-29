import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiButtonModule, TuiDialogService } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { AppState } from '../../../../app/store';
import { userCollectionsActions } from '../../../../entities/user-collections';
import { BookmarkCollectionButtonComponent } from '../../../../features/collection/bookmark-collection-button/bookmark-collection-button.component';
import { EditCollectionDialogComponent } from '../../../../features/collection/edit-collection-dialog/edit-collection-dialog.component';
import { LikeCollectionButtonComponent } from '../../../../features/collection/like-collection-button/like-collection-button.component';
import { Collection, CollectionWithInfo } from '../../../../shared/types';
import { CollectionPageStore } from '../../utils/collection-page.store';
import { CommentsDialogComponent } from '../../../../widgets/comments-dialog/comments-dialog.component';

@Component({
  selector: 'app-stats-island',
  standalone: true,
  imports: [
    TuiIslandModule,
    TuiButtonModule,
    LikeCollectionButtonComponent,
    BookmarkCollectionButtonComponent,
  ],
  templateUrl: './stats-island.component.html',
  styleUrl: './stats-island.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsIslandComponent {
  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly store: Store<AppState>,
    private readonly collectionPageStore: CollectionPageStore,
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
    this.dialogService
      .open(new PolymorpheusComponent(CommentsDialogComponent), { label: 'Комментарии' })
      .subscribe();
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

        this.collectionPageStore.setState(({ reviews }) => ({
          collectionData: collection,
          reviews,
        }));
      });
  }

  setNewStats(stats: CollectionWithInfo['socialStats']) {
    if (this.stats) {
      this.stats = { ...this.stats, ...stats };
    }
  }
}
