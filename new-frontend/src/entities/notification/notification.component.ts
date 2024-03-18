import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiButtonModule, TuiLinkModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { ProfileDirectNotification } from '../../shared/types';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [TuiIslandModule, NgOptimizedImage, RouterModule, TuiLinkModule, TuiButtonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  @Input({ required: true }) notification!: ProfileDirectNotification;

  notificationMock: ProfileDirectNotification = {
    created_at: new Date().toISOString(),
    id: 'aboba',
    payload: {},
    seen_at: null,
    type: 'COLLECTION_LIKE',
  };
}
