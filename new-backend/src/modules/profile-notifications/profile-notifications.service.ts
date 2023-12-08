import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProfileNotificationsRepository } from './profile-notifications.repository';

import { User } from '../user/models/user';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { ProfileDirectNotification } from './models/notifications/profile-direct-notification';
import { ProfileService } from '../profile/profile.service';
import { CollectionService } from '../collection/collection.service';
import { CollectionCommentService } from '../collection-comments/collection-comment.service';
import { UserEvent } from '../events/models/user-event';
import { ProfileNotification } from './models/profile-notification';
import { RMQService } from 'nestjs-rmq';

export class OutdatedEventException extends InternalServerErrorException {}

@Injectable()
export class ProfileNotificationsService {
  constructor(
    private readonly profileNotificationsRepository: ProfileNotificationsRepository,
    private readonly profileService: ProfileService,
    private readonly collectionService: CollectionService,
    private readonly collectionCommentService: CollectionCommentService,
    private readonly rmqService: RMQService,
  ) {}

  async createNotification(event: UserEvent): Promise<ProfileNotification> {
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
    eventId: UserEvent['id'],
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
    return this.profileNotificationsRepository.getAmountOfUnseenEvents(userId);
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
    const paginatedEvents =
      await this.profileNotificationsRepository.getUserNotifications(
        id,
        limit,
        type,
        nextKey,
      );

    const directNotifications = await Promise.all(
      paginatedEvents.items.map((n) => this.getDirectNotification(n)),
    );

    return {
      nextKey: paginatedEvents.nextKey,
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
      created_at: notification.event.created_at,
      seen_at: notification.seen_at,
    };

    if (notification.event.type === 'LIST_LIKED') {
      const like = await this.collectionService.getCollectionLike(
        notification.event.target_id,
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
        notification.event.target_id,
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
          notification.event.target_id,
        ),
        this.collectionCommentService.getCollectionByCommentId(
          notification.event.target_id,
        ),
      ]);

      if (!comment || !collection) {
        return null;
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

    if (notification.event.type === 'REPLY_CREATED') {
      const [reply, collection] = await Promise.all([
        this.collectionCommentService.getCommentById(
          notification.event.target_id,
        ),
        this.collectionCommentService.getCollectionByCommentId(
          notification.event.target_id,
        ),
      ]);

      if (!reply || !collection) {
        return null;
      }

      if (!reply.replyToId) {
        throw new Error(
          'Reply event: the target id points to the comment that is not a reply',
        );
      }

      const originalComment =
        await this.collectionCommentService.getCommentById(reply.replyToId);

      if (!originalComment) {
        return null;
      }

      return {
        ...resultBase,
        type: 'NEW_REPLY',
        payload: {
          reply: {
            collection,
            comment: originalComment,
            reply: reply,
          },
        },
      };
    }

    if (notification.event.type === 'SUBSCRIBED') {
      const subscription = await this.profileService.getSubscription(
        notification.event.target_id,
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
    event: UserEvent,
  ): Promise<{ userFrom: User; userTo: User } | null> {
    if (event.type === 'COMMENT_CREATED') {
      const [comment, collection] = await Promise.all([
        this.collectionCommentService.getCommentById(event.target_id),
        this.collectionCommentService.getCollectionByCommentId(event.target_id),
      ]);

      if (!comment || !collection) {
        return null;
      }

      return { userFrom: comment.user, userTo: collection.user };
    } else if (event.type === 'COMMENT_LIKED') {
      const like = await this.collectionCommentService.getCommentLike(
        event.target_id,
      );
      if (!like) {
        return null;
      }
      return { userFrom: like.user, userTo: like.collection.user };
    } else if (event.type === 'SUBSCRIBED') {
      const subscription = await this.profileService.getSubscription(
        event.target_id,
      );
      if (!subscription) {
        return null;
      }
      return { userFrom: subscription.follower, userTo: subscription.followed };
    } else if (event.type === 'REPLY_CREATED') {
      const reply = await this.collectionCommentService.getCommentById(
        event.target_id,
      );

      if (!reply) {
        return null;
      }

      const originalComment =
        await this.collectionCommentService.getCommentById(reply.id);

      if (!originalComment) {
        return null;
      }

      return { userFrom: reply.user, userTo: originalComment.user };
    } else if (event.type === 'LIST_LIKED') {
      const like = await this.collectionService.getCollectionLike(
        event.target_id,
      );
      if (!like) {
        return null;
      }

      return { userTo: like.collection.user, userFrom: like.user };
    }

    throw new Error(`UNKNOWN EVENT TYPE "${event.type}"`);
  }
}
