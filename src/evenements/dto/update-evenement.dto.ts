// ============================================
// 📁 src/evenements/dto/update-evenement.dto.ts
// ============================================
import { ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsEnum, 
  IsDateString, 
  IsOptional, 
  IsBoolean, 
  IsNumber, 
  Min 
} from 'class-validator';
import { Type } from 'class-transformer';
import { TypeEvenement, StatutEvenement } from 'generated/prisma';

export class UpdateEvenementDto {
  @ApiPropertyOptional({ description: 'Titre de l\'événement' })
  @IsString()
  @IsOptional()
  titre?: string;

  @ApiPropertyOptional({ enum: TypeEvenement })
  @IsEnum(TypeEvenement)
  @IsOptional()
  type?: TypeEvenement;

  @ApiPropertyOptional({ enum: StatutEvenement })
  @IsEnum(StatutEvenement)
  @IsOptional()
  statut?: StatutEvenement;

  @ApiPropertyOptional({ description: 'Description de l\'événement' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Date de début' })
  @IsDateString()
  @IsOptional()
  dateDebut?: string;

  @ApiPropertyOptional({ description: 'Date de fin' })
  @IsDateString()
  @IsOptional()
  dateFin?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  heureDebut?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  heureFin?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lieu?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  organisateur?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  intervenant?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  capaciteMax?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  prix?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  gratuit?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lienInscription?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lienBillet?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  estPopulaire?: boolean;

  @ApiPropertyOptional({ 
    description: 'Tags de l\'événement (JSON array)',
    type: 'string'
  })
  @IsOptional()
  tags?: string | string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  oeuvreId?: string;

  @ApiPropertyOptional({ 
    type: 'string', 
    format: 'binary',
    description: 'Nouvelle image de l\'événement'
  })
  @IsOptional()
  image?: any;
}
