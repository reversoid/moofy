import { Injectable } from '@nestjs/common';
import { SendProfileEventDTO } from '../event/utils/types';
import { CommentLikeRepository } from '../list/repositories/comment-like.repository';
import { CommentRepository } from '../list/repositories/comment.repository';
import { ListLikeRepository } from '../list/repositories/list-like.repository';
import { ListRepository } from '../list/repositories/list.repository';
import { SubscriptionRepository } from '../user/repositories/subscription.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { UserService } from '../user/user.service';
import { ProfileEventType } from './entities/profile-event.entity';
import { ProfileEventRepository } from './repositories/profile-event.repository';
import { ProfileCounterEventDTO, ProfileDirectEventDTO } from './utils/types';

@Injectable()
export class ProfileNotificationsService {
  constructor(
    private readonly eventRepository: ProfileEventRepository,
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly listRepository: ListRepository,
    private readonly commentRepository: CommentRepository,
    private readonly listLikeReposotory: ListLikeRepository,
    private readonly commentLikeRepository: CommentLikeRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async getUnseenEventsForUser(userId: number, limit = 20, lowerBound?: Date) {
    const getEvents = this.eventRepository.getUnreadEvents(
      userId,
      limit,
      lowerBound,
    );
    const getAmountOfUnseen =
      this.eventRepository.getAmountOfUnseenEvents(userId);

    const [events, unseen] = await Promise.all([getEvents, getAmountOfUnseen]);

    return { events, unseen };
  }

  async getAllEventsForUser(userId: number, limit = 20, lowerBound?: Date) {
    const getEvents = this.eventRepository.getAllEvents(
      userId,
      limit,
      lowerBound,
    );
    const getAmountOfUnseen =
      this.eventRepository.getAmountOfUnseenEvents(userId);

    const [events, unseen] = await Promise.all([getEvents, getAmountOfUnseen]);

    return { events, unseen };
  }

  async markEventAsSeen(userId: number, eventId: string) {
    return this.eventRepository.markEventAsSeen(userId, eventId);
  }

  async getAmountOfUnseenEvents(userId: number) {
    return this.eventRepository.getAmountOfUnseenEvents(userId);
  }

  async markAllEventsSeen(userId: number) {
    await this.eventRepository.markAllEventsSeen(userId);
  }

  async createEvent(data: SendProfileEventDTO): Promise<ProfileDirectEventDTO> {
    const event = await this.eventRepository.createEvent(data);
    return {
      created_at: event.created_at,
      id: event.id,
      payload: {
        comment: await this.getCommentPayload(data),
        comment_like: await this.getCommentLikePayload(data),
        list_like: await this.getListLikePayload(data),
        reply: await this.getReplyPayload(data),
        subscribe: await this.getSubscribePayload(data),
      },
    };
  }

  private async getCommentPayload(
    data: SendProfileEventDTO,
  ): Promise<ProfileDirectEventDTO['payload']['comment']> {
    if (data.eventType !== ProfileEventType.COMMENT) {
      return;
    }

    const user = await this.userService.getUserById(data.fromUserId);
    const commentId = data.targetId;
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: {
        list: true,
      },
    });
    const list = await this.listRepository.getListById(comment.list.id);
    const isSubscribed = await this.subscriptionRepository.isSubscribed(
      data.fromUserId,
      data.toUserId,
    );

    return {
      user_from: { ...user, additionalInfo: { isSubscribed } },
      comment,
      list,
    };
  }

  private async getCommentLikePayload(
    data: SendProfileEventDTO,
  ): Promise<ProfileDirectEventDTO['payload']['comment_like']> {
    if (data.eventType !== ProfileEventType.COMMENT_LIKE) {
      return;
    }

    const user = await this.userService.getUserById(data.fromUserId);
    const commentLikeId = data.targetId;
    const commentLike = await this.commentLikeRepository.findOne({
      where: { id: commentLikeId },
      relations: {
        comment: {
          list: true,
        },
      },
    });
    const list = await this.listRepository.getListById(
      commentLike.comment.list.id,
    );
    const isSubscribed = await this.subscriptionRepository.isSubscribed(
      data.fromUserId,
      data.toUserId,
    );

    return {
      user_from: { ...user, additionalInfo: { isSubscribed } },
      comment: commentLike.comment,
      list,
    };
  }

  private async getListLikePayload(
    data: SendProfileEventDTO,
  ): Promise<ProfileDirectEventDTO['payload']['list_like']> {
    if (data.eventType !== ProfileEventType.LIST_LIKE) {
      return;
    }

    const user = await this.userService.getUserById(data.fromUserId);
    const listLikeId = data.targetId;
    const listLike = await this.listLikeReposotory.findOne({
      where: { id: listLikeId },
      relations: {
        list: true,
      },
    });

    const isSubscribed = await this.subscriptionRepository.isSubscribed(
      data.fromUserId,
      data.toUserId,
    );

    return {
      user_from: { ...user, additionalInfo: { isSubscribed } },
      list: listLike.list,
    };
  }

  private async getReplyPayload(
    data: SendProfileEventDTO,
  ): Promise<ProfileDirectEventDTO['payload']['reply']> {
    if (data.eventType !== ProfileEventType.REPLY) {
      return;
    }

    const user = await this.userService.getUserById(data.fromUserId);
    const replyId = data.targetId;
    const reply = await this.commentRepository.findOne({
      where: { id: replyId },
      relations: {
        list: true,
        reply_to: true,
      },
    });
    const userComment = await this.commentRepository.findOne({
      where: { id: reply.reply_to.id },
    });

    const isSubscribed = await this.subscriptionRepository.isSubscribed(
      data.fromUserId,
      data.toUserId,
    );

    return {
      user_from: { ...user, additionalInfo: { isSubscribed } },
      list: reply.list,
      comment: userComment,
      sender_comment: reply,
    };
  }

  private async getSubscribePayload(
    data: SendProfileEventDTO,
  ): Promise<ProfileDirectEventDTO['payload']['subscribe']> {
    if (data.eventType !== ProfileEventType.SUBSCRIBE) {
      return;
    }

    const user = await this.userService.getUserById(data.fromUserId);

    const isSubscribed = await this.subscriptionRepository.isSubscribed(
      data.fromUserId,
      data.toUserId,
    );

    return {
      user_from: { ...user, additionalInfo: { isSubscribed } },
    };
  }

  async removeEvents(
    data: SendProfileEventDTO,
  ): Promise<ProfileCounterEventDTO> {
    const ids = await this.eventRepository.removeEvents(data);
    return { eventIds: ids };
  }
}
