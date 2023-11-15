import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/shared/utils/prisma-service';

@Module({
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
