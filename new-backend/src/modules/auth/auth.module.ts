import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from './configs/get-jwt-config';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync(getJwtConfig()),
    PassportModule,
    UserModule,
  ],
})
export class AuthModule {}
