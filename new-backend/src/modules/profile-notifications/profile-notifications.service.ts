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

export class OutdatedEventException extends InternalServerErrorException {}

@Injectable()
export class ProfileNotificationsService {
  constructor(
    private readonly profileEventRepository: ProfileNotificationsRepository,
    private readonly profileService: ProfileService,
    private readonly collectionService: CollectionService,
    private readonly collectionCommentService: CollectionCommentService,
  ) {}

  async createNotification(event: UserEvent): Promise<ProfileNotification> {
    const users = await this.getUsersFromEvent(event);
    if (!users) {
      throw new OutdatedEventException();
    }

    const notification = this.profileEventRepository.createNotification({
      eventId: event.id,
      fromUserId: users.userFrom.id,
      toUserId: users.userTo.id,
    });

    return notification;
  }

  async findNotificationByEventId(
    event: UserEvent,
  ): Promise<ProfileNotification | null> {
    const notification =
      await this.profileEventRepository.findNotificationByEventId(event.id);
    return notification;
  }

  async markNotificationAsSeen(
    notificationId: ProfileNotification['id'],
  ): Promise<void> {
    const event = await this.profileEventRepository.markNotificationAsSeen(
      notificationId,
    );

    if (event) {
      this.eventService.emitProfileSeenEvent({
        eventId,
      });
    }

    return eventId;
  }

  async getAmountOfUnseenNotification(userId: User['id']): Promise<number> {
    return this.profileEventRepository.getAmountOfUnseenEvents(userId);
  }

  async markAllNotificationsAsSeen(userId: User['id']): Promise<void> {
    await this.profileEventRepository.markAllNotificationsAsSeen(userId);

    this.eventService.emitProfileSeenEvent({
      eventId: '__ALL__',
    });
  }

  async getNotificationsForUser(
    id: User['id'],
    limit: number,
    type: 'all' | 'seen' | 'unseen',
    nextKey?: string,
  ): Promise<PaginatedData<ProfileDirectNotification>> {
    const paginatedEvents = await this.profileEventRepository.getUserEvents(
      id,
      limit,
      type,
      nextKey,
    );

    const notifications = await Promise.all(
      paginatedEvents.items.map((event) =>
        this.getDirectNotification(event.id),
      ),
    );

    return {
      nextKey: paginatedEvents.nextKey,
      items: notifications.filter(
        (n) => n !== null,
      ) as ProfileDirectNotification[],
    };
  }

  async getDirectNotification(
    eventId: ProfileEvent['id'],
  ): Promise<ProfileDirectNotification | null> {
    const event = await this.profileEventRepository.getNotificationById(
      eventId,
    );
    if (!event) {
      return null;
    }
    const notificationBase: Pick<
      ProfileDirectNotification,
      'id' | 'created_at'
    > = {
      id: eventId,
      created_at: event.created_at,
    };

    if (event.type === 'LIST_LIKE') {
      if (!event.target_id) {
        throw new Error('No target id for list like event');
      }
      const like = await this.collectionService.getCollectionLike(
        event.target_id,
      );

      if (!like) {
        return null;
      }

      return {
        ...notificationBase,
        payload: {
          collection_like: {
            collection: like.collection,
            user_from: like.user,
          },
        },
      };
    }

    if (event.type === 'COMMENT_LIKE') {
      if (!event.target_id) {
        throw new Error('No target id for comment like event');
      }
      const like = await this.collectionCommentService.getCommentLike(
        event.target_id,
      );
      if (!like) {
        return null;
      }
      return {
        ...notificationBase,
        payload: {
          comment_like: {
            collection: like.collection,
            user_from: like.user,
            comment: like.comment,
          },
        },
      };
    }

    if (event.type === 'COMMENT') {
      if (!event.target_id) {
        throw new Error('No target id for comment event');
      }
      const [comment, collection] = await Promise.all([
        this.collectionCommentService.getCommentById(event.target_id),
        this.collectionCommentService.getCollectionByCommentId(event.target_id),
      ]);

      if (!comment || !collection) {
        return null;
      }

      return {
        ...notificationBase,
        payload: {
          comment: {
            collection: collection,
            comment,
          },
        },
      };
    }

    if (event.type === 'REPLY') {
      if (!event.target_id) {
        throw new Error('No target id for reply event');
      }

      const [reply, collection] = await Promise.all([
        this.collectionCommentService.getCommentById(event.target_id),
        this.collectionCommentService.getCollectionByCommentId(event.target_id),
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
        ...notificationBase,
        payload: {
          reply: {
            collection,
            comment: originalComment,
            reply: reply,
          },
        },
      };
    }

    if (event.type === 'SUBSCRIBE') {
      if (!event.target_id) {
        throw new Error('No target id for subscribe event');
      }

      const subscription = await this.profileService.getSubscription(
        event.target_id,
      );
      if (!subscription) {
        return null;
      }
      return {
        ...notificationBase,
        payload: { subscribe: { user_from: subscription.follower } },
      };
    }

    throw new Error(`Unknown event type ${event.type}`);
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
