import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserModule } from '../user/user.module';
import { ListModule } from '../list/list.module';
import { EventModule } from '../event/event.module';

@Module({
  imports: [UserModule, ListModule, EventModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
