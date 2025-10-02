/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { LoginUtilisateurDto } from './dto/login-utilisateur.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilisateursService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async create(createUtilisateurDto: CreateUtilisateurDto) {
    const existingUser = await this.prisma.utilisateur.findUnique({
      where: { email: createUtilisateurDto.email }
    });

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(createUtilisateurDto.motDePasse, 10);

    const utilisateur = await this.prisma.utilisateur.create({
      data: {
        nom: createUtilisateurDto.nom,
        email: createUtilisateurDto.email,
        motDePasse: hashedPassword,
        languePreferee: createUtilisateurDto.languePreferee || 'FR',
      },
    });

    const { motDePasse, ...result } = utilisateur;
    
    // Générer le token JWT avec la clé secrète
    const token = this.jwtService.sign(
      {
        sub: utilisateur.id,
        email: utilisateur.email,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION') || '7d',
      }
    );

    return {
      ...result,
      access_token: token,
    };
  }

  async login(loginUtilisateurDto: LoginUtilisateurDto) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { email: loginUtilisateurDto.email }
    });

    if (!utilisateur) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUtilisateurDto.motDePasse,
      utilisateur.motDePasse
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const { motDePasse, ...result } = utilisateur;
    
    // Générer le token JWT avec la clé secrète
    const token = this.jwtService.sign(
      {
        sub: utilisateur.id,
        email: utilisateur.email,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION') || '7d',
      }
    );

    return {
      ...result,
      access_token: token,
    };
  }

  async findAll() {
    const utilisateurs = await this.prisma.utilisateur.findMany({
      select: {
        id: true,
        nom: true,
        email: true,
        languePreferee: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    return utilisateurs;
  }

  async findOne(id: string) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id: id },
      select: {
        id: true,
        nom: true,
        email: true,
        languePreferee: true,
        createdAt: true,
        updatedAt: true,
        favoris: {
          include: {
            oeuvre: {
              select: {
                id: true,
                titre: true,
                imageUrl: true,
                categorie: true,
              }
            }
          }
        },
        historique: {
          include: {
            oeuvre: {
              select: {
                id: true,
                titre: true,
                imageUrl: true,
              }
            }
          },
          orderBy: { dateConsultation: 'desc' },
          take: 10
        }
      },
    });

    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }

    return utilisateur;
  }

  async update(id: string, updateUtilisateurDto: Partial<CreateUtilisateurDto>) {
    await this.findOne(id);

    if (updateUtilisateurDto.email) {
      const existingUser = await this.prisma.utilisateur.findUnique({
        where: { email: updateUtilisateurDto.email }
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
    }

    const dataToUpdate: any = { ...updateUtilisateurDto };

    if (updateUtilisateurDto.motDePasse) {
      dataToUpdate.motDePasse = await bcrypt.hash(updateUtilisateurDto.motDePasse, 10);
    }

    const utilisateur = await this.prisma.utilisateur.update({
      where: { id: id },
      data: dataToUpdate,
      select: {
        id: true,
        nom: true,
        email: true,
        languePreferee: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return utilisateur;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.utilisateur.delete({
      where: { id },
    });

    return { message: 'Utilisateur supprimé avec succès' };
  }

  async getFavoris(id: string) {
    await this.findOne(id);

    const favoris = await this.prisma.favori.findMany({
      where: { utilisateurId: id },
      include: {
        oeuvre: {
          include: {
            descriptions: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return favoris;
  }

  async getHistorique(id: string) {
    await this.findOne(id);

    const historique = await this.prisma.historique.findMany({
      where: { utilisateurId: id },
      include: {
        oeuvre: {
          select: {
            id: true,
            titre: true,
            imageUrl: true,
            categorie: true,
          }
        }
      },
      orderBy: { dateConsultation: 'desc' },
      take: 50
    });

    return historique;
  }

  async clearHistorique(id: string) {
    await this.findOne(id);

    await this.prisma.historique.deleteMany({
      where: { utilisateurId: id }
    });

    return { message: 'Historique effacé avec succès' };
  }
}