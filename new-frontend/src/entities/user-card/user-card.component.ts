import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButtonModule, TuiLinkModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { User } from '../../shared/types';
import { CardComponent } from '../../shared/ui/card/card.component';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [
    NgOptimizedImage,
    TuiIslandModule,
    RouterLink,
    TuiLinkModule,
    TuiButtonModule,
    CardComponent,
    NgClass,
  ],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  @Input({ required: true }) user!: User;

  @Input() view?: 'vertical' | 'horizontal' = 'vertical';
}
