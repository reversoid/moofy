import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from './configs/getJWTConfig';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './passport/jwt.strategy';
import { ListModule } from '../list/list.module';
import { ValidationService } from './utils/validation.service';

@Module({
  imports: [
    JwtModule.registerAsync(getJWTConfig()),
    UserModule,
    PassportModule,
    ListModule,
  ],
  providers: [AuthService, JwtStrategy, ValidationService],
  controllers: [AuthController],
  exports: [ValidationService],
})
export class AuthModule {}
