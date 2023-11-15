import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Redis } from 'ioredis';
import globalConfig, { AppEnvironments } from 'src/config/global.config';
import { UnauthorizedException } from './exceptions/unauthorized.exception';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from './passport/tokens-payload.type';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/models/user';
import { Tokens } from './types';

const getRefreshTokenRedisKey = (userId: number) =>
  `user:${userId}:refresh_tokens`;

@Injectable()
export class TokensService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @Inject(globalConfig.KEY)
    private config: ConfigType<typeof globalConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async validateRefreshToken(userId: User['id'], refreshToken: string) {
    const isTokenValid = await this.isTokenValid(userId, refreshToken);
    if (!isTokenValid) {
      throw new UnauthorizedException();
    }
  }

  async isTokenValid(userId: number, token: string) {
    const key = getRefreshTokenRedisKey(userId);
    return Boolean(await this.redis.sismember(key, token));
  }

  async makeRefreshTokenValid(userId: number, token: string) {
    const key = getRefreshTokenRedisKey(userId);
    return this.redis.sadd(key, token);
  }

  async makeRefreshTokenInvalid(userId: number, token: string) {
    const key = getRefreshTokenRedisKey(userId);
    return this.redis.srem(key, token);
  }

  async decodeRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      const data =
        await this.jwtService.verifyAsync<RefreshTokenPayload>(token);
      return data;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async generateTokens(userId: User['id']): Promise<Tokens> {
    const accessTokenPayload: AccessTokenPayload = { id: userId };
    const access = await this.jwtService.signAsync(accessTokenPayload, {
      expiresIn:
        this.config.environment === AppEnvironments.prod ? '15m' : '300d',
    });

    const refreshTokenPayload: RefreshTokenPayload = { id: userId };
    const refresh = await this.jwtService.signAsync(refreshTokenPayload, {
      expiresIn: '60d',
    });

    await this.makeRefreshTokenValid(userId, refresh);

    return { access, refresh };
  }
}
