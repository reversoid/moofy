import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { Profile } from '../profile.service';

export class EditProfileDTO
  implements
    Partial<Omit<Profile, 'allLists' | 'favLists' | 'id' | 'created_at'>>
{
  @IsString()
  @MaxLength(400)
  @IsOptional()
  description?: string;

  @IsString()
  @MaxLength(32)
  @IsOptional()
  username?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(120)
  imageUrl?: string;
}
