import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { Currency } from '@prisma/client';

class PriceDto {
  @IsOptional()
  price?: number;

  @IsEnum(Currency)
  currency: Currency;
}

export class CreateProductItemDto {
  @IsString()
  productId: string;

  @IsString()
  barcode: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  online: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceDto)
  prices: PriceDto[];

  @IsOptional()
  quantity?: number; // Ajouté manuellement pour respecter exigences
}