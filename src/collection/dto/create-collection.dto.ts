// src/collections/dto/create-collection.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsBoolean, 
  IsOptional, 
  MaxLength 
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCollectionDto {
  @ApiProperty({
    description: 'Nom de la collection',
    example: 'Bronzes Royaux du Bénin',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  nom: string;

  @ApiProperty({
    description: 'Description détaillée de la collection',
    example: 'Une collection exceptionnelle de bronzes royaux datant du XVIe au XIXe siècle',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Thème principal de la collection',
    example: 'Art royal du Bénin',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  theme: string;

  @ApiPropertyOptional({
    description: 'Indique si la collection est permanente',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  estPermanente?: boolean;
}

export class UpdateCollectionDto {
  @ApiPropertyOptional({
    description: 'Nom de la collection',
    example: 'Bronzes Royaux du Bénin - Édition 2024',
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  nom?: string;

  @ApiPropertyOptional({
    description: 'Description détaillée de la collection',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Thème principal de la collection',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  theme?: string;

  @ApiPropertyOptional({
    description: 'Indique si la collection est permanente',
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  estPermanente?: boolean;
}

export class CollectionResponseDto {
  @ApiProperty({ example: 'uuid-123-456' })
  id: string;

  @ApiProperty({ example: 'Bronzes Royaux du Bénin' })
  nom: string;

  @ApiProperty({ example: 'Une collection exceptionnelle...' })
  description: string;

  @ApiProperty({ example: 'Art royal du Bénin' })
  theme: string;

  @ApiPropertyOptional({ example: 'https://cloudinary.com/image.jpg' })
  imageUrl?: string;

  @ApiProperty({ example: true })
  estPermanente: boolean;

  @ApiPropertyOptional({ example: '2024-01-15T00:00:00Z' })
  dateCreation?: Date;

  @ApiProperty({ example: '2024-10-05T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-10-05T10:00:00Z' })
  updatedAt: Date;

  @ApiPropertyOptional({
    type: 'array',
    description: 'Liste des œuvres de la collection',
  })
  oeuvres?: any[];

  @ApiPropertyOptional({
    example: 25,
    description: 'Nombre total d\'œuvres dans la collection',
  })
  nombreOeuvres?: number;
}