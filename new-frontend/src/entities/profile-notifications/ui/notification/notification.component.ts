import { NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiButtonModule, TuiLinkModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { ProfileDirectNotification } from '../../../../shared/types';

const notificationMock: ProfileDirectNotification = {
  created_at: new Date().toISOString(),
  id: 'aboba',
  payload: {
    subscribe: {
      user_from: {
        createdAt: '',
        description: 'Some desc',
        id: 2,
        imageUrl: null,
        username: 'sosimba',
      },
    },
  },
  seen_at: null,
  type: 'NEW_FOLLOWER',
};

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    TuiIslandModule,
    NgOptimizedImage,
    RouterModule,
    TuiLinkModule,
    TuiButtonModule,
    NgIf,
    TuiSvgModule,
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  @Input() notification: ProfileDirectNotification = notificationMock;

  get user() {
    const payload = this.notification.payload;

    return (
      payload.collection_like?.user_from ??
      payload.comment?.comment.user ??
      payload.comment_like?.user_from ??
      payload.reply?.reply.user ??
      payload.subscribe?.user_from!
    );
  }

  get commentLink() {
    const payload = this.notification.payload;

    if (payload.comment) {
      return ['collections', payload.comment.collection.id, 'comments', payload.comment.comment.id];
    }

    if (payload.comment_like) {
      return [
        'collections',
        payload.comment_like.collection.id,
        'comments',
        payload.comment_like.comment.id,
      ];
    }

    if (payload.reply) {
      return ['collections', payload.reply.collection.id, 'comments', payload.reply.reply.id];
    }

    return null;
  }

  get collectionLink() {
    const payload = this.notification.payload;
    if (payload.collection_like) {
      return ['collections', payload.collection_like.collection.id];
    }
    return null;
  }
}
