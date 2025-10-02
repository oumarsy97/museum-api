import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUtilisateurDto } from './create-utilisateur.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { Langue } from 'generated/prisma';

export class UpdateUtilisateurDto extends PartialType(CreateUtilisateurDto) {
  @ApiPropertyOptional({ example: 'Jean Martin' })
  @IsOptional()
  @IsString()
  nom?: string;

  @ApiPropertyOptional({ example: 'jean.martin@example.com' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'NewPassword123!' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  motDePasse?: string;

  @ApiPropertyOptional({ enum: ['FR', 'EN', 'WO'], example: 'EN' })
  @IsOptional()
  languePreferee?: Langue;
}