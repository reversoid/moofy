import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from './configs/get-jwt-config';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    JwtModule.registerAsync(getJwtConfig()),
    PassportModule,
    UserModule,
    EventsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
