import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from './configs/get-jwt-config';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { EventsModule } from '../events/events.module';
import { TokensService } from './services/tokens.service';

@Module({
  imports: [
    JwtModule.registerAsync(getJwtConfig()),
    PassportModule,
    UserModule,
    EventsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokensService],
})
export class AuthModule {}
