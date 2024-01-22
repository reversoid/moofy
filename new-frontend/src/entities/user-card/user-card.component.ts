import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiButtonModule, TuiLinkModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { User } from '../../shared/types';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [NgOptimizedImage, TuiIslandModule, RouterModule, TuiLinkModule, TuiButtonModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  @Input({ required: true }) user!: User;

  get linkToProfile() {
    return `/profile/${this.user.id}`;
  }
}
