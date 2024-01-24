import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgOptimizedImage, TuiIslandModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  // TODO implement
  @Input() view?: 'vertical' | 'horizontal';

  @Input() title?: string;

  @Input() hoverable = false;
}
