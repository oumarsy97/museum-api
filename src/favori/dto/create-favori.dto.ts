// create-favori.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateFavoriDto {
  @ApiPropertyOptional({ 
    description: 'ID de l\'utilisateur (sera extrait automatiquement du token)',
    example: 'user-123-abc'
  })
  @IsOptional()
  @IsString()
  utilisateurId?: string;

  @ApiProperty({ 
    description: 'ID de l\'oeuvre à ajouter aux favoris',
    example: 'oeuvre-456-def'
  })
  @IsNotEmpty()
  @IsString()
  oeuvreId: string;

  @ApiPropertyOptional({ 
    description: 'Date de création',
    example: '2025-10-02T10:00:00Z'
  })
  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @ApiPropertyOptional({ 
    description: 'Date de mise à jour',
    example: '2025-10-02T10:00:00Z'
  })
  @IsOptional()
  @IsDateString()
  updatedAt?: Date;
}

