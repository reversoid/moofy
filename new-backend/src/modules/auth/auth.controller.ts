import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { HttpResponse } from 'src/shared/utils/decorators/http-response.decorator';
import {
  LoginResponse,
  loginResponseSchema,
} from './dto/responses/login.response';
import {
  RegisterResponse,
  registerResponseSchema,
} from './dto/responses/register.response';
import {
  RefreshResponse,
  refreshResponseSchema,
} from './dto/responses/refresh.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpResponse(loginResponseSchema)
  async login(
    @Body() { username, password }: LoginDto,
  ): Promise<LoginResponse> {
    const { tokens, user } = await this.authService.login({
      username,
      password,
    });

    return { accessToken: tokens.access, user };
  }

  @Post('register')
  @HttpResponse(registerResponseSchema)
  async register(
    @Body() { password, username }: RegisterDto,
  ): Promise<RegisterResponse> {
    const { tokens, user } = await this.authService.register({
      username,
      password,
    });

    return { accessToken: tokens.access, user };
  }

  @Post('logout')
  async logout() {
    await this.authService.logout('token');
  }

  @Post('refresh')
  @HttpResponse(refreshResponseSchema)
  async refresh(): Promise<RefreshResponse> {
    const { tokens, user } = await this.authService.refresh('token');

    return { accessToken: tokens.access, user };
  }
}
