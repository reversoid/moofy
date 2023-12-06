import { Injectable } from '@nestjs/common';
import { CreateProfileEventDto } from './dto/create-profile-event.dto';
import { RemoveProfileEventDto } from './dto/remove-profile-event.dto';
import { ProfileEventRepository } from './repository/profile-event.repository';
import { ProfileEvent, profileEventSchema } from './models/profile-event';
import { User } from '../user/models/user';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { ProfileDirectNotification } from './models/notifications/profile-direct-notification';
import { ProfileService } from '../profile/profile.service';
import { CollectionService } from '../collection/collection.service';
import { CollectionCommentService } from '../collection-comments/collection-comment.service';
import { EventsService } from '../events/events.service';

@Injectable()
export class ProfileNotificationsService {
  constructor(
    private readonly profileEventRepository: ProfileEventRepository,
    private readonly profileService: ProfileService,
    private readonly collectionService: CollectionService,
    private readonly collectionCommentService: CollectionCommentService,
    private readonly eventService: EventsService,
  ) {}

  async createEvent(dto: CreateProfileEventDto): Promise<ProfileEvent> {
    const event = this.profileEventRepository.createEvent(dto);
    return profileEventSchema.parse(event);
  }

  async removeEvent(dto: RemoveProfileEventDto): Promise<ProfileEvent | null> {
    const event = await this.profileEventRepository.removeEvent(dto);
    return profileEventSchema.parse(event);
  }

  async markEventAsSeen(
    eventId: ProfileEvent['id'],
  ): Promise<ProfileEvent['id']> {
    const event = await this.profileEventRepository.markEventAsSeen(eventId);

    if (event) {
      this.eventService.emitProfileSeenEvent({
        eventId,
      });
    }

    return eventId;
  }

  async getAmountOfUnseenEvents(userId: User['id']): Promise<number> {
    return this.profileEventRepository.getAmountOfUnseenEvents(userId);
  }

  async markAllEventsSeen(userId: User['id']): Promise<void> {
    await this.profileEventRepository.markAllEventsAsSeen(userId);

    this.eventService.emitProfileSeenEvent({
      eventId: '__ALL__',
    });
  }

  async getEventsForUser(
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
    const event = await this.profileEventRepository.getEvent(eventId);
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
}
