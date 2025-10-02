/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, MinLength, IsNotEmpty } from 'class-validator';
import { Langue } from 'generated/prisma';

export class CreateUtilisateurDto {
  @ApiProperty({ example: 'Jean Dupont', description: 'Nom complet de l\'utilisateur' })
  @IsString()
  @IsNotEmpty()
  nom: string;
  //prenom
  @ApiProperty({ example: 'Jean', description: 'Prénom de l\'utilisateur' })
  @IsString()
  @IsNotEmpty()
  prenom: string;

  @ApiProperty({ example: 'jean.dupont@example.com', description: 'Email unique' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Mot de passe (min 6 caractères)' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  motDePasse: string;

  @ApiProperty({ 
    enum: ['FR', 'EN', 'WO'], 
    example: 'FR', 
    description: 'Langue préférée',
    default: 'FR'
  })
  @IsEnum(['FR', 'EN', 'WO'])
  languePreferee?: Langue;
}