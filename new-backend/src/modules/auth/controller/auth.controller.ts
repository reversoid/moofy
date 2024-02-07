import { CookieSerializeOptions } from '@fastify/cookie';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AppEnvironments } from 'src/config/global.config';
import { HttpResponse } from 'src/shared/utils/decorators/http-response.decorator';
import { AuthService } from '../auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponse, loginResponseSchema } from './responses/login.response';
import {
  RefreshResponse,
  refreshResponseSchema,
} from './responses/refresh.response';
import {
  RegisterResponse,
  registerResponseSchema,
} from './responses/register.response';

import { ApiTags } from '@nestjs/swagger';
import { GlobalConfig } from '../../global/global.config';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';
import { RefreshToken } from './decorators/refresh-token.decorator';
import { HasRefreshGuard } from './guards/has-refresh-token.guard';
import { REFRESH_TOKEN_KEY } from './utils/refresh-token-key';
import { ParseStringPipe } from 'src/shared/parse-string-pipe';
import {
  UserExistsResponse,
  userExistsResponseSchema,
} from './responses/user-exists.response';

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
    @Res({ passthrough: true }) response: FastifyReply,
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
    @Body() { username, password }: RegisterDto,
    @Res({ passthrough: true }) response: FastifyReply,
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
  @UseGuards(HasRefreshGuard)
  async logout(
    @RefreshToken(ParseStringPipe) token: string,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    try {
      await this.authService.logout(token);
      response.clearCookie(REFRESH_TOKEN_KEY, DEFAULT_REFRESH_COOKIE_OPTIONS);
    } catch (error) {
      response.clearCookie(REFRESH_TOKEN_KEY, DEFAULT_REFRESH_COOKIE_OPTIONS);
      throw error;
    }
  }

  @Get('user-exists')
  @HttpResponse(userExistsResponseSchema)
  async userExists(
    @Query('username') username: string = '',
  ): Promise<UserExistsResponse> {
    const exists = await this.authService.userExists(username);
    return { exists };
  }

  @Post('protected/refresh')
  @UseGuards(HasRefreshGuard)
  @HttpResponse(refreshResponseSchema)
  async refresh(
    @RefreshToken(ParseStringPipe) token: string,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<RefreshResponse> {
    try {
      const { tokens, user } = await this.authService.refresh(token);

      response.setCookie(
        REFRESH_TOKEN_KEY,
        tokens.refresh,
        this.refreshCookieOptions,
      );

      return { accessToken: tokens.access, user };
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        response.clearCookie(REFRESH_TOKEN_KEY, DEFAULT_REFRESH_COOKIE_OPTIONS);
        throw new BadRequestException();
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
