// ============================================
// 📁 src/evenements/dto/inscription.dto.ts
// ============================================
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateInscriptionDto {
  @ApiProperty({ 
    description: 'ID de l\'événement',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsNotEmpty()
  evenementId: string;

  @ApiPropertyOptional({ 
    description: 'Nombre de places réservées',
    example: 1,
    default: 1
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  nombrePlaces?: number;
}
