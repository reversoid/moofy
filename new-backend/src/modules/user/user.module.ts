import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { UserRepository } from './user.repository';

@Module({
  providers: [UserService, PrismaService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
