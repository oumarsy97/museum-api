/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import {
  Utilisateur as PrismaUtilisateur,
  Langue,
  ROLE,
} from '../../../generated/prisma';
import { Exclude } from 'class-transformer';

export class UtilisateurEntity implements PrismaUtilisateur {
  @ApiProperty({ example: 1 })
  id: string;

  @ApiProperty({ example: 'Jean Dupont' })
  nom: string;

  @ApiProperty({ example: 'jean.dupont@example.com' })
  email: string;

  @ApiProperty( { enum: ROLE, example: 'ADMIN' })
  role: ROLE;

  @Exclude()
  motDePasse: string;

  @ApiProperty({ enum: Langue, example: 'FR' })
  languePreferee: Langue;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<UtilisateurEntity>) {
    Object.assign(this, partial);
  }
}
