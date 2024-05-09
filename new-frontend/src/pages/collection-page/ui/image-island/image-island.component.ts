import { NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDialogService } from '@taiga-ui/core';
import { TuiIslandModule, TuiMarkerIconModule } from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs';
import { ImageDialogComponent } from '../../../../shared/ui/image-dialog/image-dialog.component';

@Component({
  selector: 'app-image-island',
  standalone: true,
  imports: [TuiIslandModule, NgOptimizedImage, NgIf, TuiMarkerIconModule, TuiButtonModule],
  templateUrl: './image-island.component.html',
  styleUrl: './image-island.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ImageIslandComponent {
  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly destroy$: TuiDestroyService,
  ) {}

  @Input() imageUrl?: string | null;

  openImage() {
    if (!this.imageUrl) {
      return;
    }

    this.dialogService
      .open(new PolymorpheusComponent(ImageDialogComponent), {
        data: { imageUrl: this.imageUrl },
        size: 'auto',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
