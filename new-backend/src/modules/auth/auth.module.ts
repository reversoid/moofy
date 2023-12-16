import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from './configs/get-jwt-config';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './auth.service';
import { EventsModule } from '../events/events.module';
import { TokensService } from './utils/tokens.service';
import { ValidationService } from './utils/validation.service';
import { JwtStrategy } from './passport/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync(getJwtConfig()),
    PassportModule,
    UserModule,
    EventsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokensService, ValidationService, JwtStrategy],
  exports: [ValidationService],
})
export class AuthModule {}
