import { Injectable } from '@nestjs/common';
import { User, userSchema } from './models/user';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CreateUserProps } from './types';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getUserById(id: User['id']): Promise<User | null> {
    const user = await this.prismaService.users.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        description: true,
        image_url: true,
      },
    });

    if (!user) {
      return null;
    }

    return userSchema.parse(user);
  }

  async createUser(props: CreateUserProps): Promise<User | null> {
    const r = await this.prismaService
      .$queryRaw`INSERT INTO "users" (username, password_hash) VALUES (${props.username}, ${props.passwordHash})`;

    return userSchema.parse(r);
  }
}
