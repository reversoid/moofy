import { CookieSerializeOptions } from '@fastify/cookie';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AppEnvironments } from 'src/config/global.config';
import { HttpResponse } from 'src/shared/utils/decorators/http-response.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  LoginResponse,
  loginResponseSchema,
} from './dto/responses/login.response';
import {
  RefreshResponse,
  refreshResponseSchema,
} from './dto/responses/refresh.response';
import {
  RegisterResponse,
  registerResponseSchema,
} from './dto/responses/register.response';

import { GlobalConfig } from '../global/global.config';
import { UnauthorizedException } from './exceptions/unauthorized.exception';
import { ApiTags } from '@nestjs/swagger';

const REFRESH_TOKEN_KEY = 'refresh_token';

const DEFAULT_REFRESH_COOKIE_OPTIONS: CookieSerializeOptions = {
  signed: true,
  path: '/auth/protected',
};

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private config: GlobalConfig,
  ) {}

  @Post('login')
  @HttpResponse(loginResponseSchema)
  async login(
    @Body() { username, password }: LoginDto,
    @Res() response: FastifyReply,
  ): Promise<LoginResponse> {
    const { tokens, user } = await this.authService.login({
      username,
      password,
    });

    response.setCookie(
      REFRESH_TOKEN_KEY,
      tokens.refresh,
      this.refreshCookieOptions,
    );

    return { accessToken: tokens.access, user };
  }

  @Post('register')
  @HttpResponse(registerResponseSchema)
  async register(
    @Body() { password, username }: RegisterDto,
    @Res() response: FastifyReply,
  ): Promise<RegisterResponse> {
    const { tokens, user } = await this.authService.register({
      username,
      password,
    });

    response.setCookie(
      REFRESH_TOKEN_KEY,
      tokens.refresh,
      this.refreshCookieOptions,
    );

    return { accessToken: tokens.access, user };
  }

  @Post('protected/logout')
  async logout(@Res() response: FastifyReply) {
    try {
      await this.authService.logout('token');
      response.clearCookie(REFRESH_TOKEN_KEY, DEFAULT_REFRESH_COOKIE_OPTIONS);
    } catch (error) {
      response.clearCookie(REFRESH_TOKEN_KEY, DEFAULT_REFRESH_COOKIE_OPTIONS);
      throw error;
    }
  }

  @Post('protected/refresh')
  @HttpResponse(refreshResponseSchema)
  async refresh(@Res() response: FastifyReply): Promise<RefreshResponse> {
    try {
      const { tokens, user } = await this.authService.refresh('token');

      response.setCookie(
        REFRESH_TOKEN_KEY,
        tokens.refresh,
        this.refreshCookieOptions,
      );

      return { accessToken: tokens.access, user };
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        response.clearCookie(REFRESH_TOKEN_KEY, DEFAULT_REFRESH_COOKIE_OPTIONS);
      }
      throw error;
    }
  }

  get refreshCookieOptions(): CookieSerializeOptions {
    const DAYS_TO_EXPIRE = 60;
    const dateInFuture = new Date(
      new Date().setDate(new Date().getDate() + DAYS_TO_EXPIRE),
    );
    return {
      ...DEFAULT_REFRESH_COOKIE_OPTIONS,
      secure: ![AppEnvironments.dev].includes(this.config.environment),
      httpOnly: ![AppEnvironments.dev, AppEnvironments.test].includes(
        this.config.environment,
      ),
      sameSite: AppEnvironments.test ? 'none' : 'lax',
      expires: dateInFuture,
    };
  }
}
