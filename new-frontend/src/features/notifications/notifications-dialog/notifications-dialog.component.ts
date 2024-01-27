import { NgFor, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiLinkModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { DirectNotificationType } from '../../../shared/types';

const notificationsText: Record<DirectNotificationType, string> = {
  COLLECTION_LIKE: 'нравится ваша коллекция',
  COMMENT_LIKE: 'нравится ваш комментарий',
  NEW_COMMENT: 'добавил комментарий',
  NEW_FOLLOWER: 'подписался на вас',
  NEW_REPLY: 'ответил на комментарий',
};

@Component({
  selector: 'app-notifications-dialog',
  standalone: true,
  imports: [TuiIslandModule, NgOptimizedImage, NgFor, TuiLinkModule, RouterModule],
  templateUrl: './notifications-dialog.component.html',
  styleUrl: './notifications-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsDialogComponent {
  mock = Object.values(notificationsText);
}
