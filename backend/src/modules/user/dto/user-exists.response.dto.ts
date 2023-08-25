import { ApiProperty } from '@nestjs/swagger';

export class UserExistsResponseDTO {
  @ApiProperty()
  userExists: boolean;
}
