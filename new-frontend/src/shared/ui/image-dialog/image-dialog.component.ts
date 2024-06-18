import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'app-image-dialog',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './image-dialog.component.html',
  styleUrl: './image-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageDialogComponent {
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, { imageUrl: string }>,
  ) {}

  imageUrl = this.context.data.imageUrl;
}
