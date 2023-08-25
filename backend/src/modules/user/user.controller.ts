import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { UserService } from './user.service';
import { UserExistsResponseDTO } from './dto/user-exists.response.dto';

class CheckUserExistenceDTO {
  @IsOptional()
  @IsString()
  username: string;
}

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    description: 'Check if user exists',
  })
  @ApiResponse({ description: 'Result', type: UserExistsResponseDTO })
  @Get('existence')
  async checkUserExistence(
    @Query(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    { username = '' }: CheckUserExistenceDTO,
  ): Promise<{ userExists: boolean }> {
    const userExists = await this.userService.userExists({ username });
    return { userExists };
  }
}
