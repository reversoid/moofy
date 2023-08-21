import { Body, Controller, Get, Inject, Post, Req, Res } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CookieOptions, Request, Response } from 'express';
import globalConfig, { AppEnvironments } from 'src/config/global.config';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { RegisterDTO } from './dtos/register.dto';
import { ListService } from '../list/list.service';
import { AuthResponse } from './dtos/responses/auth.response';

const DEFAULT_REFRESH_COOKIE_OPTIONS: CookieOptions = {
  signed: true,
  path: '/auth/protected',
};

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly listService: ListService,
    @Inject(globalConfig.KEY)
    private config: ConfigType<typeof globalConfig>,
  ) {}

  @ApiOperation({
    description: 'Register',
  })
  @ApiResponse({ description: 'Result', type: AuthResponse })
  @Post('register')
  async register(
    @Body() dto: RegisterDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = await this.authService.createUser(dto);

    // TODO possible to make better?
    await Promise.all([
      this.listService.createList(userId, {
        name: 'Избранное',
        isPublic: true,
      }),
      this.listService.createList(userId, {
        name: 'Посмотреть',
        isPublic: false,
      }),
    ]);

    const { access, refresh } = await this.authService.generateTokens(userId);

    response.cookie('refresh_token', refresh, this.getRefreshCookieOptions());
    return { access_token: access, userId };
  }

  @ApiOperation({
    description: 'Login',
  })
  @ApiResponse({ description: 'Result', type: AuthResponse })
  @Post('login')
  async login(
    @Body() dto: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = await this.authService.validateUser(dto);
    const { access, refresh } = await this.authService.generateTokens(userId);

    response.cookie('refresh_token', refresh, this.getRefreshCookieOptions());

    return { access_token: access, userId };
  }

  @ApiOperation({
    description:
      'Updates auth and refresh token. Refresh token must be set in cookie.',
  })
  @ApiResponse({ description: 'Result', type: AuthResponse })
  @Get('protected/checkout')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const oldToken: string = request.signedCookies['refresh_token'];

      const { access, refresh, userId } = await this.authService.refresh(
        oldToken,
      );

      response.cookie('refresh_token', refresh, this.getRefreshCookieOptions());

      return { access_token: access, userId };
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    description: 'Logout user',
  })
  @Get('protected/logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const refreshToken: string = request.signedCookies['refresh_token'];
      await this.authService.logout(refreshToken);

      response.clearCookie('refresh_token', DEFAULT_REFRESH_COOKIE_OPTIONS);
    } catch (error) {
      response.clearCookie('refresh_token', DEFAULT_REFRESH_COOKIE_OPTIONS);
      throw error;
    }
  }

  private getRefreshCookieOptions(): CookieOptions {
    const DAYS_TO_EXPIRE = 59;
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
