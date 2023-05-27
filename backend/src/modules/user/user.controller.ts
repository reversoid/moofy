import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UserService } from './user.service';

class CheckUserExistenceDTO {
  @IsOptional()
  email: string;

  @IsOptional()
  username: string;
}

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    description: 'Check if user exists',
  })
  @Get('existence')
  async checkUserExistence(
    @Query(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    { email = '', username = '' }: CheckUserExistenceDTO,
  ): Promise<{ userExists: boolean }> {
    const userExists = await this.userService.userExists({ email, username });
    return { userExists };
  }
}
