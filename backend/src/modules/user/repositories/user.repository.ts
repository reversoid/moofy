import { Injectable } from '@nestjs/common/decorators';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { getTsQueryFromString } from 'src/shared/libs/full-text-search/get-ts-query-from-string';
import { ProfileShort } from 'src/modules/profile/types/profile-short.type';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
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
      .select(['user.id', 'user.username', 'user.image_url'])
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
}
