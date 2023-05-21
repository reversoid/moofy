import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';

import { FilmType } from 'src/modules/film/entities/film.entity';

export class FilmDTO {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsInt()
  year: number;

  @IsEnum(FilmType)
  type: FilmType;

  @IsOptional()
  @Matches(/^[\d]{2,3}\:[\d]{2}$/)
  filmLength?: string;

  @IsOptional()
  @IsUrl()
  posterPreviewUrl?: string;

  @IsOptional()
  @IsUrl()
  posterUrl?: string;

  @IsOptional()
  @IsString({ each: true })
  genres: string[];
}
