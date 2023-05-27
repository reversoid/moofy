import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserModule } from '../user/user.module';
import { ListModule } from '../list/list.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [UserModule, ListModule],
})
export class ProfileModule {}
