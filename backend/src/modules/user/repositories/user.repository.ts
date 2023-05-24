import { Injectable } from '@nestjs/common/decorators';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

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
}
