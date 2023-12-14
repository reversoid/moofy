import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProfileNotificationsRepository } from './profile-notifications.repository';

import { User } from '../user/models/user';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { ProfileDirectNotification } from './models/notifications/profile-direct-notification';
import { ProfileService } from '../profile/profile.service';
import { CollectionService } from '../collection/collection.service';
import { CollectionCommentService } from '../collection-comments/collection-comment.service';
import { ProfileNotification } from './models/profile-notification';
import { ProfileEvent } from './models/profile-event';

export class OutdatedEventException extends InternalServerErrorException {}

@Injectable()
export class ProfileNotificationsService {
  constructor(
    private readonly profileNotificationsRepository: ProfileNotificationsRepository,
    private readonly profileService: ProfileService,
    private readonly collectionService: CollectionService,
    private readonly collectionCommentService: CollectionCommentService,
  ) {}

  async createNotification(event: ProfileEvent): Promise<ProfileNotification> {
    const users = await this.getUsersFromEvent(event);
    if (!users) {
      throw new OutdatedEventException();
    }

    const notification = this.profileNotificationsRepository.createNotification(
      {
        eventId: event.id,
        fromUserId: users.userFrom.id,
        toUserId: users.userTo.id,
      },
    );

    return notification;
  }

  async findNotificationByEventId(
    eventId: ProfileEvent['id'],
  ): Promise<ProfileNotification | null> {
    const notification =
      await this.profileNotificationsRepository.findNotificationByEventId(
        eventId,
      );
    return notification;
  }

  async markNotificationAsSeen(
    notificationId: ProfileNotification['id'],
  ): Promise<ProfileNotification | null> {
    const notification =
      await this.profileNotificationsRepository.markNotificationAsSeen(
        notificationId,
      );

    return notification;
  }

  async getAmountOfUnseenNotification(userId: User['id']): Promise<number> {
    return this.profileNotificationsRepository.getAmountOfUnseenNotifications(
      userId,
    );
  }

  async markAllNotificationsAsSeen(userId: User['id']): Promise<void> {
    await this.profileNotificationsRepository.markAllNotificationsAsSeen(
      userId,
    );
  }

  async getNotificationsForUser(
    id: User['id'],
    limit: number,
    type: 'all' | 'seen' | 'unseen',
    nextKey?: string,
  ): Promise<PaginatedData<ProfileDirectNotification>> {
    const paginatedNotifications =
      await this.profileNotificationsRepository.getUserNotifications(
        id,
        limit,
        type,
        nextKey,
      );

    const directNotifications = await Promise.all(
      paginatedNotifications.items.map((n) => this.getDirectNotification(n)),
    );

    return {
      nextKey: paginatedNotifications.nextKey,
      items: directNotifications.filter(
        (n) => n !== null,
      ) as ProfileDirectNotification[],
    };
  }

  async getDirectNotification(
    notification: ProfileNotification,
  ): Promise<ProfileDirectNotification | null> {
    const resultBase: Pick<
      ProfileDirectNotification,
      'id' | 'created_at' | 'seen_at'
    > = {
      id: notification.id,
      created_at: notification.event.createdAt,
      seen_at: notification.seenAt,
    };

    if (notification.event.type === 'LIST_LIKED') {
      const like = await this.collectionService.getCollectionLike(
        notification.event.targetId,
      );

      if (!like) {
        return null;
      }

      return {
        ...resultBase,
        type: 'COLLECTION_LIKE',
        payload: {
          collection_like: {
            collection: like.collection,
            user_from: like.user,
          },
        },
      };
    }

    if (notification.event.type === 'COMMENT_LIKED') {
      const like = await this.collectionCommentService.getCommentLike(
        notification.event.targetId,
      );
      if (!like) {
        return null;
      }
      return {
        ...resultBase,
        type: 'COMMENT_LIKE',
        payload: {
          comment_like: {
            collection: like.collection,
            user_from: like.user,
            comment: like.comment,
          },
        },
      };
    }

    if (notification.event.type === 'COMMENT_CREATED') {
      const [comment, collection] = await Promise.all([
        this.collectionCommentService.getCommentById(
          notification.event.targetId,
        ),
        this.collectionCommentService.getCollectionByCommentId(
          notification.event.targetId,
        ),
      ]);

      if (!comment || !collection) {
        return null;
      }

      if (comment.replyToId) {
        const originalComment =
          await this.collectionCommentService.getCommentById(comment.replyToId);

        if (!originalComment) {
          return null;
        }

        return {
          ...resultBase,
          type: 'NEW_REPLY',
          payload: {
            reply: { collection, reply: comment, comment: originalComment },
          },
        };
      }

      return {
        ...resultBase,
        type: 'NEW_COMMENT',
        payload: {
          comment: {
            collection: collection,
            comment,
          },
        },
      };
    }

    if (notification.event.type === 'SUBSCRIBED') {
      const subscription = await this.profileService.getSubscription(
        notification.event.targetId,
      );
      if (!subscription) {
        return null;
      }
      return {
        ...resultBase,
        type: 'NEW_FOLLOWER',
        payload: { subscribe: { user_from: subscription.follower } },
      };
    }

    throw new Error(`Unknown event type ${notification.event.type}`);
  }

  private async getUsersFromEvent(
    event: ProfileEvent,
  ): Promise<{ userFrom: User; userTo: User } | null> {
    if (event.type === 'COMMENT_CREATED') {
      const [comment, collection] = await Promise.all([
        this.collectionCommentService.getCommentById(event.targetId),
        this.collectionCommentService.getCollectionByCommentId(event.targetId),
      ]);

      if (!comment || !collection) {
        return null;
      }

      if (comment.replyToId) {
        const originalComment =
          await this.collectionCommentService.getCommentById(comment.replyToId);

        if (!originalComment) {
          return null;
        }

        return { userFrom: comment.user, userTo: originalComment.user };
      }

      return { userFrom: comment.user, userTo: collection.user };
    } else if (event.type === 'COMMENT_LIKED') {
      const like = await this.collectionCommentService.getCommentLike(
        event.targetId,
      );
      if (!like) {
        return null;
      }
      return { userFrom: like.user, userTo: like.collection.user };
    } else if (event.type === 'SUBSCRIBED') {
      const subscription = await this.profileService.getSubscription(
        event.targetId,
      );
      if (!subscription) {
        return null;
      }
      return { userFrom: subscription.follower, userTo: subscription.followed };
    } else if (event.type === 'LIST_LIKED') {
      const like = await this.collectionService.getCollectionLike(
        event.targetId,
      );
      if (!like) {
        return null;
      }

      return { userTo: like.collection.user, userFrom: like.user };
    }

    throw new Error(`UNKNOWN EVENT TYPE "${event.type}"`);
  }
}
