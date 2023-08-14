import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendCommentDTO {
  @IsString()
  @MaxLength(400)
  text: string;

  @IsInt()
  @IsOptional()
  replyToId?: number;
}
