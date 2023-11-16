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
  async login(@Body() data: LoginDto): Promise<LoginResponse> {}

  @Post('register')
  @HttpResponse(registerResponseSchema)
  async register(@Body() data: RegisterDto): Promise<RegisterResponse> {}

  @Post('logout')
  async logout() {}

  @Post('refresh')
  @HttpResponse(refreshResponseSchema)
  async refresh(): Promise<RefreshResponse> {}
}
