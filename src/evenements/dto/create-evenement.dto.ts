// ============================================
// 📁 src/evenements/dto/create-evenement.dto.ts
// ============================================
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsEnum, 
  IsNotEmpty, 
  IsDateString, 
  IsOptional, 
  IsBoolean, 
  IsNumber, 
  IsArray, 
  Min 
} from 'class-validator';
import { Type } from 'class-transformer';
import { TypeEvenement, StatutEvenement } from 'generated/prisma';

export class CreateEvenementDto {
  @ApiProperty({ 
    description: 'Titre de l\'événement',
    example: 'Conférence : L\'héritage de la reine Nzinga'
  })
  @IsString()
  @IsNotEmpty()
  titre: string;

  @ApiProperty({ 
    enum: TypeEvenement,
    description: 'Type d\'événement',
    example: 'CONFERENCE'
  })
  @IsEnum(TypeEvenement)
  type: TypeEvenement;

  @ApiPropertyOptional({ 
    enum: StatutEvenement,
    description: 'Statut de l\'événement',
    example: 'A_VENIR',
    default: 'A_VENIR'
  })
  @IsEnum(StatutEvenement)
  @IsOptional()
  statut?: StatutEvenement;

  @ApiProperty({ 
    description: 'Description détaillée de l\'événement',
    example: 'Rejoignez Dr. Anya Olaoye pour une conférence éclairante...'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ 
    description: 'Date et heure de début',
    example: '2024-07-15T14:00:00Z'
  })
  @IsDateString()
  dateDebut: string;

  @ApiPropertyOptional({ 
    description: 'Date et heure de fin',
    example: '2024-07-15T16:00:00Z'
  })
  @IsDateString()
  @IsOptional()
  dateFin?: string;

  @ApiPropertyOptional({ 
    description: 'Heure de début (format HH:mm)',
    example: '14:00'
  })
  @IsString()
  @IsOptional()
  heureDebut?: string;

  @ApiPropertyOptional({ 
    description: 'Heure de fin (format HH:mm)',
    example: '16:00'
  })
  @IsString()
  @IsOptional()
  heureFin?: string;

  @ApiProperty({ 
    description: 'Lieu de l\'événement',
    example: 'Auditorium MCN'
  })
  @IsString()
  @IsNotEmpty()
  lieu: string;

  @ApiPropertyOptional({ 
    description: 'Organisateur de l\'événement',
    example: 'Musée des Civilisations Noires'
  })
  @IsString()
  @IsOptional()
  organisateur?: string;

  @ApiPropertyOptional({ 
    description: 'Intervenant ou conférencier',
    example: 'Dr. Anya Olaoye'
  })
  @IsString()
  @IsOptional()
  intervenant?: string;

  @ApiPropertyOptional({ 
    description: 'Capacité maximale de participants',
    example: 100
  })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  capaciteMax?: number;

  @ApiPropertyOptional({ 
    description: 'Prix de l\'événement',
    example: 5000
  })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  prix?: number;

  @ApiPropertyOptional({ 
    description: 'L\'événement est-il gratuit ?',
    example: true,
    default: true
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  gratuit?: boolean;

  @ApiPropertyOptional({ 
    description: 'Lien d\'inscription',
    example: 'https://forms.gle/abc123'
  })
  @IsString()
  @IsOptional()
  lienInscription?: string;

  @ApiPropertyOptional({ 
    description: 'Lien pour acheter des billets',
    example: 'https://billets.mcn.sn/event/123'
  })
  @IsString()
  @IsOptional()
  lienBillet?: string;

  @ApiPropertyOptional({ 
    description: 'Marquer comme événement populaire',
    example: false,
    default: false
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  estPopulaire?: boolean;

  @ApiPropertyOptional({ 
    description: 'Tags de l\'événement (JSON array)',
    example: '["Histoire", "Culture", "Conférence"]',
    type: 'string'
  })
  @IsOptional()
  tags?: string | string[];

  @ApiPropertyOptional({ 
    description: 'ID de l\'oeuvre associée',
  })
  @IsString()
  @IsOptional()
  oeuvreId?: string;

  // Image upload
  @ApiPropertyOptional({ 
    type: 'string', 
    format: 'binary',
    description: 'Image de l\'événement'
  })
  @IsOptional()
  image?: any;
}
