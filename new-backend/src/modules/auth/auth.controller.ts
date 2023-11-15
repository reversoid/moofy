import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() data: LoginDto) {}

  @Post('register')
  async register(@Body() data: RegisterDto) {}
}
