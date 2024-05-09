import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiButtonModule, TuiDialogContext, TuiDialogService, TuiLinkModule } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT, PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Collection } from '../../../../shared/types';
import { RouterModule } from '@angular/router';
import dayjs from 'dayjs';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { TuiIslandModule, TuiMarkerIconModule } from '@taiga-ui/kit';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { ImageDialogComponent } from '../../../../shared/ui/image-dialog/image-dialog.component';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-collection-info-dialog',
  standalone: true,
  imports: [
    RouterModule,
    NgOptimizedImage,
    NgIf,
    TuiLinkModule,
    TuiMarkerIconModule,
    TuiIslandModule,
    TuiButtonModule,
  ],
  templateUrl: './collection-info-dialog.component.html',
  styleUrl: './collection-info-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class CollectionInfoDialogComponent {
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, { collection: Collection }>,
    private readonly dialogService: TuiDialogService,
    private readonly destroy$: TuiDestroyService,
  ) {}

  creatorUsername = this.context.data.collection.user.username;

  creatorUrl = ['/profile', this.context.data.collection.user.id];

  creatorImageUrl = this.context.data.collection.user.imageUrl;

  creatorDescription = this.context.data.collection.user.description;

  imageUrl = this.context.data.collection.imageUrl;

  updatedAt = dayjs(this.context.data.collection.updatedAt).format('DD.MM.YYYY');

  openImage() {
    this.dialogService
      .open(new PolymorpheusComponent(ImageDialogComponent), {
        size: 'auto',
        data: { imageUrl: this.imageUrl },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
