import { IsString, MaxLength } from 'class-validator';

export class RegisterDTO {
  @IsString()
  @MaxLength(32)
  username: string;

  @IsString()
  password: string;
}
