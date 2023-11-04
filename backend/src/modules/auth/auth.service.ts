import { HttpException, Inject, Injectable } from '@nestjs/common';
import { AuthErrors } from 'src/errors/auth.errors';
import { LoginDTO } from './dtos/login.dto';
import { RegisterDTO } from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { UserRepository } from '../user/repositories/user.repository';
import globalConfig, { AppEnvironments } from 'src/config/global.config';
import { ConfigType } from '@nestjs/config';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from './passport/token-payload.type';

interface Tokens {
  access: string;
  refresh: string;
}

const geRefreshTokenRedisKey = (userId: number) =>
  `user:${userId}:refresh_tokens`;

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
    @Inject(globalConfig.KEY)
    private config: ConfigType<typeof globalConfig>,
  ) {}

  async createUser({ password, username }: RegisterDTO): Promise<number> {
    const existingUser = await this.userRepository.findUserByEmailOrUsername(
      username,
    );
    if (existingUser) {
      throw new HttpException(AuthErrors.USERNAME_ALREADY_TAKEN, 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userEntity = this.userRepository.create({
      username,
      password_hash: passwordHash,
    });
    return (await this.userRepository.save(userEntity)).id;
  }

  async validateUser({ username, password }: LoginDTO): Promise<number> {
    const user = await this.userRepository.getUserWithHashPassword(username);

    if (!user) {
      throw new HttpException(AuthErrors.WRONG_CREDENTIALS, 400);
    }

    try {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password_hash,
      );

      if (!isPasswordCorrect) throw new Error();
    } catch {
      throw new HttpException(AuthErrors.WRONG_CREDENTIALS, 400);
    }

    return user.id;
  }

  async generateTokens(userId: number): Promise<Tokens> {
    const accessTokenPayload: AccessTokenPayload = { id: userId };
    const access = await this.jwtService.signAsync(accessTokenPayload, {
      expiresIn:
        this.config.environment === AppEnvironments.prod ? '15m' : '300d',
    });

    const refreshTokenPayload: RefreshTokenPayload = { id: userId };
    const refresh = await this.jwtService.signAsync(refreshTokenPayload, {
      expiresIn: '60d',
    });

    await this.makeTokenValid(userId, refresh);

    return { access, refresh };
  }

  async decodeRefreshToken(token: string): Promise<{ id: number }> {
    try {
      const data = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        token,
      );
      return data;
    } catch (error) {
      throw new HttpException(AuthErrors.INVALID_REFRESH_TOKEN, 401);
    }
  }

  async refresh(refreshToken: string) {
    const { id } = await this.decodeRefreshToken(refreshToken);

    await this.validateUserById(id);
    await this.validateRefreshToken(id, refreshToken);
    await this.makeTokenInvalid(id, refreshToken);

    const tokens = await this.generateTokens(id);
    return { ...tokens, userId: id };
  }

  async logout(refreshToken: string) {
    const { id } = await this.decodeRefreshToken(refreshToken);

    await this.validateUserById(id);
    await this.validateRefreshToken(id, refreshToken);
    await this.makeTokenInvalid(id, refreshToken);

    return { success: true };
  }

  private async validateRefreshToken(userId: number, refreshToken: string) {
    const isTokenValid = await this.isTokenValid(userId, refreshToken);
    if (!isTokenValid) {
      throw new HttpException(AuthErrors.INVALID_REFRESH_TOKEN, 401);
    }
  }

  private async validateUserById(id: number) {
    const userExists = await this.userRepository.userExists(id);

    if (!userExists)
      throw new HttpException(AuthErrors.INVALID_REFRESH_TOKEN, 401);
  }

  private async isTokenValid(userId: number, token: string) {
    const key = geRefreshTokenRedisKey(userId);
    return Boolean(await this.redis.sismember(key, token));
  }

  private async makeTokenValid(userId: number, token: string) {
    const key = geRefreshTokenRedisKey(userId);
    return this.redis.sadd(key, token);
  }

  private async makeTokenInvalid(userId: number, token: string) {
    const key = geRefreshTokenRedisKey(userId);
    return this.redis.srem(key, token);
  }
}
