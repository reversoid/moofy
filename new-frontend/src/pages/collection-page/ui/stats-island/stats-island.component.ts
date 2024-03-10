import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiButtonModule, TuiDialogService, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiCheckboxBlockModule, TuiIslandModule } from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { AppState } from '../../../../app/store';
import { userCollectionsActions } from '../../../../entities/user-collections';
import { EditCollectionDialogComponent } from '../../../../features/collection/edit-collection-dialog/edit-collection-dialog.component';
import { Collection, CollectionWithInfo } from '../../../../shared/types';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { finalize, map, switchAll, takeUntil } from 'rxjs';
import { CollectionService } from '../../../../features/collection/utils/collection.service';

@Component({
  selector: 'app-stats-island',
  standalone: true,
  imports: [
    TuiIslandModule,
    TuiButtonModule,
    TuiCheckboxBlockModule,
    TuiSvgModule,
    FormsModule,
    ReactiveFormsModule,
    TuiLoaderModule,
  ],
  templateUrl: './stats-island.component.html',
  styleUrl: './stats-island.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class StatsIslandComponent implements OnInit {
  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly store: Store<AppState>,
    private readonly destroy$: TuiDestroyService,
    private readonly collectionService: CollectionService,
  ) {}

  @Input() isPersonal = false;

  @Input({ required: true }) collection!: Collection | null;

  @Input({ required: true }) stats!: {
    likesAmount: number;
    commentsAmount: number;
    isLiked: boolean;
    isFavorite: boolean;
  } | null;

  actionsGroup = new FormGroup({
    like: new FormControl(false),
    bookmark: new FormControl(false),
  });

  isProcessingLike = signal(false);

  isProcessingBookmark = signal(false);

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

  ngOnInit(): void {
    this.initializeControlsValues();
    this.initializeControlsActions();
  }

  private initializeControlsValues() {
    this.actionsGroup.setValue({
      like: Boolean(this.stats?.isLiked),
      bookmark: Boolean(this.stats?.isFavorite),
    });
  }

  private initializeControlsActions() {
    this.initializeLike();
    this.initializeBookmark();
  }

  // TODO make separate component for like and bookmark

  private initializeLike() {
    this.actionsGroup.controls.like.valueChanges
      .pipe(
        map((like) => {
          this.isProcessingLike.set(true);
          const collectionId = this.collection!.id;
          if (like) {
            return this.collectionService.likeCollection(collectionId);
          } else {
            return this.collectionService.unlikeCollection(collectionId);
          }
        }),

        map((v) =>
          v.pipe(
            finalize(() => {
              this.isProcessingLike.set(false);
            }),
          ),
        ),

        switchAll(),

        takeUntil(this.destroy$),
      )
      .subscribe(({ commentsAmount, likesAmount }) => {
        console.log(commentsAmount, likesAmount);
      });
  }

  private initializeBookmark() {
    this.actionsGroup.controls.bookmark.valueChanges
      .pipe(
        map((bookmark) => {
          this.isProcessingBookmark.set(true);
          const collectionId = this.collection!.id;
          if (bookmark) {
            return this.collectionService.likeCollection(collectionId);
          } else {
            return this.collectionService.unlikeCollection(collectionId);
          }
        }),

        map((v) =>
          v.pipe(
            finalize(() => {
              this.isProcessingLike.set(false);
            }),
          ),
        ),

        switchAll(),

        takeUntil(this.destroy$),
      )
      .subscribe(({ commentsAmount, likesAmount }) => {
        console.log(commentsAmount, likesAmount);
      });
  }
}
