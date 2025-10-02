// dto/create-oeuvre.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Langue } from 'generated/prisma';

export class CreateDescriptionDto {
  @ApiProperty({ enum: Langue })
  @IsEnum(Langue)
  langue: Langue;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  texte: string;
}

export class CreateOeuvreDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  titre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  qrCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categorie: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  artiste: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  localisation: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  annee: number;

  @ApiPropertyOptional({ type: 'string', description: 'JSON des descriptions' })
  @IsOptional()
  descriptions?: CreateDescriptionDto[] | string;

  // IMPORTANT: Ajouter ces propriétés pour que NestJS accepte les fichiers
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  image?: any;

  @ApiPropertyOptional({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsOptional()
  medias?: any;
}

export class UpdateOeuvreDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  titre?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  qrCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  categorie?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  image?: any;

  @ApiPropertyOptional({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsOptional()
  medias?: any;
}