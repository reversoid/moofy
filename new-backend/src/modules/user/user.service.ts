import { Injectable } from '@nestjs/common';
import { User } from './models/user';
import { PrismaService } from 'src/shared/utils/prisma-service';

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
    return user;
  }
}
