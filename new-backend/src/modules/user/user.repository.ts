import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { ChangeUserDataProps, CreateUserProps } from './types';
import { User, selectUser } from './models/user';
import { FullUser, selectFullUser } from './models/full-user';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser({ passwordHash, username }: CreateUserProps): Promise<User> {
    return await this.prismaService.users.create({
      data: { password_hash: passwordHash, username },
      select: selectUser,
    });
  }

  async getUserById(id: User['id']): Promise<User | null> {
    return this.prismaService.users.findUnique({
      where: { id },
      select: selectUser,
    });
  }

  async getUserByUsername(username: User['username']): Promise<User | null> {
    return this.prismaService.users.findUnique({
      where: { username },
      select: selectUser,
    });
  }

  async getFullUserByUsername(
    username: User['username'],
  ): Promise<FullUser | null> {
    return this.prismaService.users.findUnique({
      where: { username },
      select: selectFullUser,
    });
  }

  async changeUserData(
    userId: User['id'],
    props: ChangeUserDataProps,
  ): Promise<User> {
    return this.prismaService.users.update({
      where: { id: userId },
      data: {
        image_url: props.imageUrl,
        username: props.username,
        description: props.description,
      },
      select: selectFullUser,
    });
  }
}
