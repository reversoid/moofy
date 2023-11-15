import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CreateUserProps } from './types';
import { User, selectUser } from './models/user';

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
}
