// ============================================
// 📁 src/evenements/dto/filter-evenement.dto.ts
// ============================================
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDateString, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { TypeEvenement, StatutEvenement } from 'generated/prisma';

export class FilterEvenementDto {
  @ApiPropertyOptional({ 
    enum: TypeEvenement,
    description: 'Filtrer par type d\'événement'
  })
  @IsEnum(TypeEvenement)
  @IsOptional()
  type?: TypeEvenement;

  @ApiPropertyOptional({ 
    enum: StatutEvenement,
    description: 'Filtrer par statut'
  })
  @IsEnum(StatutEvenement)
  @IsOptional()
  statut?: StatutEvenement;

  @ApiPropertyOptional({ 
    description: 'Filtrer par date de début (après)',
    example: '2024-07-01'
  })
  @IsDateString()
  @IsOptional()
  dateDebutApres?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrer par date de début (avant)',
    example: '2024-12-31'
  })
  @IsDateString()
  @IsOptional()
  dateDebutAvant?: string;

  @ApiPropertyOptional({ 
    description: 'Afficher uniquement les événements populaires',
    example: true
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  estPopulaire?: boolean;

  @ApiPropertyOptional({ 
    description: 'Afficher uniquement les événements gratuits',
    example: true
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  gratuit?: boolean;

  @ApiPropertyOptional({ 
    description: 'Recherche par mot-clé (titre, description)',
    example: 'hackathon'
  })
  @IsString()
  @IsOptional()
  recherche?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrer par tag',
    example: 'Tech'
  })
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiPropertyOptional({ 
    description: 'Numéro de page',
    example: 1,
    default: 1
  })
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ 
    description: 'Nombre d\'éléments par page',
    example: 10,
    default: 10
  })
  @Type(() => Number)
  @IsOptional()
  limit?: number;
}