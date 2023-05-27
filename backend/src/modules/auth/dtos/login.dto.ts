import { IsString, MaxLength } from 'class-validator';

export class LoginDTO {
  @IsString()
  @MaxLength(32)
  username: string;

  @IsString()
  password: string;
}
