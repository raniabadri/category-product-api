import { IsString, IsArray, ValidateNested, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { Language } from '@prisma/client';

class ContentDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  details?: string;

  @IsEnum(Language)
  language: Language;
}

export class CreateProductDto {
  @IsArray()
  @IsString({ each: true })
  categoryIds: string[]; // Many-to-many avec Category

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentDto)
  contents: ContentDto[]; // Tableau pour les 3 langues
}