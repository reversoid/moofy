import { Injectable } from '@nestjs/common/decorators';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { getTsQueryFromString } from 'src/shared/libs/full-text-search/get-ts-query-from-string';
import { ProfileShort } from 'src/modules/profile/types/profile-short.type';
import { Review } from 'src/modules/review/entities/review.entity';
import { Subscription } from '../entities/subscription.entity';
import { PaginatedRepository } from 'src/shared/pagination/paginated.repository';

const TOP_USER_COEFFS = { followers: 4, reviews: 2 } as const;

@Injectable()
export class UserRepository extends PaginatedRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  /** Get one user with specified username or email*/
  async findUserByEmailOrUsername(username?: string, email?: string) {
    return this.findOne({
      where: [
        {
          email,
        },
        {
          username,
        },
      ],
    });
  }

  /** Get user with hashed password*/
  async getUserWithHashPassword(username: string) {
    return this.findOne({
      where: {
        username,
      },
      select: {
        password_hash: true,
        id: true,
      },
    });
  }

  async userExists(id: number) {
    return Boolean(
      await this.findOne({
        where: { id },
        select: {
          id: true,
        },
      }),
    );
  }

  async findUserByEmail(email: string) {
    return this.findOne({
      where: [
        {
          email,
        },
      ],
    });
  }

  async findUserByUsername(username: string) {
    return this.findOne({
      where: [
        {
          username,
        },
      ],
    });
  }

  async getUserInfoById(id: number) {
    return this.findOne({
      where: {
        id,
      },
      select: {
        created_at: true,
        description: true,
        id: true,
        image_url: true,
        username: true,
      },
    });
  }

  async searchUsersByUsername(
    username: string,
    limit: number,
  ): Promise<Omit<ProfileShort, 'additionalInfo'>[]> {
    if (!username) {
      return this.find({
        select: {
          id: true,
          image_url: true,
          username: true,
          description: true,
        },
        take: limit,
        order: {
          created_at: 'ASC',
        },
      });
    }
    const words = getTsQueryFromString(username);

    return this.createQueryBuilder()
      .from(User, 'user')
      .select([
        'user.id',
        'user.username',
        'user.image_url',
        'user.description',
      ])
      .addSelect(
        `
         ts_rank(user.username_search_document, plainto_tsquery('simple', :initial_search_string)) +
         ts_rank(user.username_search_document, to_tsquery('simple', :search_string))
        `,
        'rank',
      )
      .where(
        `(user.username_search_document) @@ plainto_tsquery('simple', :initial_search_string)
        `,
        {
          initial_search_string: username,
        },
      )
      .orWhere(
        `(user.username_search_document) @@ to_tsquery('simple', :search_string)`,
        {
          search_string: words,
        },
      )
      .orderBy('rank', 'DESC')
      .take(limit)
      .getMany();
  }

  async getTopUsers(limit: number) {
    const users = await this.createQueryBuilder('user')
      .leftJoinAndSelect(Subscription, 'subs', 'subs.followed_id = user.id')
      .leftJoinAndSelect(
        Review,
        'review',
        'review.user = user.id AND review.score IS NOT NULL',
      )
      .select([
        'user.id',
        'user.username',
        'user.image_url',
        'user.description',
      ])
      .addSelect(
        `COUNT(DISTINCT subs.id) * ${TOP_USER_COEFFS.followers} + COUNT(DISTINCT review.id) * ${TOP_USER_COEFFS.reviews}`,
        'rating',
      )
      .groupBy('user.username')
      .addGroupBy('user.id')
      .orderBy('rating', 'DESC')
      .take(limit)
      .getMany();

    return users;
  }
}
