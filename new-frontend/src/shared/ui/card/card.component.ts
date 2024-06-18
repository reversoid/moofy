import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [TuiIslandModule, NgClass, RouterLink, NgIf, NgTemplateOutlet],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() view?: 'vertical' | 'horizontal' = 'vertical';
}
