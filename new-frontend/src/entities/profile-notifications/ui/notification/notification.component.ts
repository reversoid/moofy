import { NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiButtonModule, TuiLinkModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { ProfileDirectNotification } from '../../../../shared/types';

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
  @Input() notification?: ProfileDirectNotification;

  get user() {
    if (!this.notification) {
      return null;
    }

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
    if (!this.notification) {
      return null;
    }

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
    if (!this.notification) {
      return null;
    }

    const payload = this.notification.payload;
    if (payload.collection_like) {
      return ['collections', payload.collection_like.collection.id];
    }
    return null;
  }
}
