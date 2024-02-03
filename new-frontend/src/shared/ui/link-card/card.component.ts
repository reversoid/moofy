import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgOptimizedImage, TuiIslandModule, NgClass],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() view?: 'vertical' | 'horizontal' = 'vertical';

  @Input() fixedImageSize? = true;

  @Input() title?: string;

  @Input() hoverable = false;
}
