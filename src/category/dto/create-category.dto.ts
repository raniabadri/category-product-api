import { IsString, IsOptional, IsArray, ValidateNested, IsEnum } from 'class-validator';
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

  @IsEnum(Language)
  language: Language;
}

export class CreateCategoryDto {
  @IsString()
  @IsOptional()
  parentCategoryId?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentDto)
  contents: ContentDto[]; // Tableau pour les 3 langues (Arabe, Anglais, Français)
}