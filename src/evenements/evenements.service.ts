

// ============================================
// 📁 src/evenements/evenements.service.ts
// ============================================
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudnaryService } from '../service/cloudnary.service';
import { CreateEvenementDto } from './dto/create-evenement.dto';
import { UpdateEvenementDto } from './dto/update-evenement.dto';
import { FilterEvenementDto } from './dto/filter-evenement.dto';
import { CreateInscriptionDto } from './dto/inscription.dto';

@Injectable()
export class EvenementsService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudnaryService
  ) {}

  async create(createEvenementDto: CreateEvenementDto, image?: Express.Multer.File) {
    const { oeuvreId, prix, tags, ...rest } = createEvenementDto;

    // Upload de l'image sur Cloudinary
    let imageUrl: string;
    if (image) {
      const uploadResult = await this.cloudinaryService.uploadImage(image);
      imageUrl = uploadResult.secure_url;
    } else {
      throw new BadRequestException('L\'image de l\'événement est requise');
    }

    // Vérifier si l'oeuvre existe
    if (oeuvreId) {
      const oeuvre = await this.prisma.oeuvre.findUnique({
        where: { id: oeuvreId }
      });
      if (!oeuvre) {
        throw new NotFoundException(`Oeuvre avec l'ID ${oeuvreId} non trouvée`);
      }
    }

    // Parser les tags si c'est une string JSON
    let parsedTags: string[] = [];
    if (tags) {
      if (typeof tags === 'string') {
        try {
          parsedTags = JSON.parse(tags);
        } catch {
          parsedTags = [tags];
        }
      } else {
        parsedTags = tags;
      }
    }

    return this.prisma.evenement.create({
      data: {
        ...rest,
        imageUrl,
        prix: prix ? prix.toString() : null,
        tags: parsedTags,
      },
      include: {
        oeuvre: true,
        inscriptions: {
          include: {
            utilisateur: {
              select: {
                id: true,
                nom: true,
                email: true
              }
            }
          }
        }
      }
    });
  }

  async findAll(filters: FilterEvenementDto) {
    const {
      type,
      statut,
      dateDebutApres,
      dateDebutAvant,
      estPopulaire,
      gratuit,
      recherche,
      tag,
      page = 1,
      limit = 10
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (type) where.type = type;
    if (statut) where.statut = statut;
    if (estPopulaire !== undefined) where.estPopulaire = estPopulaire;
    if (gratuit !== undefined) where.gratuit = gratuit;

    if (dateDebutApres || dateDebutAvant) {
      where.dateDebut = {};
      if (dateDebutApres) where.dateDebut.gte = new Date(dateDebutApres);
      if (dateDebutAvant) where.dateDebut.lte = new Date(dateDebutAvant);
    }

    if (recherche) {
      where.OR = [
        { titre: { contains: recherche, mode: 'insensitive' } },
        { description: { contains: recherche, mode: 'insensitive' } }
      ];
    }

    if (tag) {
      where.tags = { has: tag };
    }

    const [evenements, total] = await Promise.all([
      this.prisma.evenement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dateDebut: 'asc' },
        include: {
          oeuvre: {
            select: {
              id: true,
              titre: true,
              imageUrl: true
            }
          },
          _count: {
            select: { inscriptions: true }
          }
        }
      }),
      this.prisma.evenement.count({ where })
    ]);

    return {
      data: evenements,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: string) {
    const evenement = await this.prisma.evenement.findUnique({
      where: { id },
      include: {
        oeuvre: true,
        inscriptions: {
          include: {
            utilisateur: {
              select: {
                id: true,
                nom: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: { inscriptions: true }
        }
      }
    });

    if (!evenement) {
      throw new NotFoundException(`Événement avec l'ID ${id} non trouvé`);
    }

    return evenement;
  }

  async update(id: string, updateEvenementDto: UpdateEvenementDto, image?: Express.Multer.File) {
    const evenement = await this.findOne(id);

    const { oeuvreId, prix, tags, ...rest } = updateEvenementDto;

    let imageUrl: string | undefined;

    // Upload nouvelle image si fournie
    if (image) {
      // Supprimer l'ancienne image de Cloudinary
      if (evenement.imageUrl) {
        const publicId = this.extractPublicIdFromUrl(evenement.imageUrl);
        if (publicId) {
          await this.cloudinaryService.deleteFile(publicId, 'image');
        }
      }

      const uploadResult = await this.cloudinaryService.uploadImage(image);
      imageUrl = uploadResult.secure_url;
    }

    // Vérifier l'oeuvre si fournie
    if (oeuvreId) {
      const oeuvre = await this.prisma.oeuvre.findUnique({
        where: { id: oeuvreId }
      });
      if (!oeuvre) {
        throw new NotFoundException(`Oeuvre avec l'ID ${oeuvreId} non trouvée`);
      }
    }

    // Parser les tags si c'est une string JSON
    let parsedTags: string[] | undefined;
    if (tags) {
      if (typeof tags === 'string') {
        try {
          parsedTags = JSON.parse(tags);
        } catch {
          parsedTags = [tags];
        }
      } else {
        parsedTags = tags;
      }
    }

    return this.prisma.evenement.update({
      where: { id },
      data: {
        ...rest,
        ...(imageUrl && { imageUrl }),
        prix: prix ? prix.toString() : undefined,
        ...(parsedTags && { tags: parsedTags }),
        oeuvreId,
      },
      include: {
        oeuvre: true,
        _count: {
          select: { inscriptions: true }
        }
      }
    });
  }

  async remove(id: string) {
    const evenement = await this.findOne(id);

    // Supprimer l'image de Cloudinary
    if (evenement.imageUrl) {
      const publicId = this.extractPublicIdFromUrl(evenement.imageUrl);
      if (publicId) {
        await this.cloudinaryService.deleteFile(publicId, 'image');
      }
    }

    return this.prisma.evenement.delete({ where: { id } });
  }

  // Extraire le publicId d'une URL Cloudinary
  private extractPublicIdFromUrl(url: string): string | null {
    try {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      const publicId = filename.split('.')[0];
      const folder = parts[parts.length - 2];
      return `${folder}/${publicId}`;
    } catch {
      return null;
    }
  }

  // ========== GESTION DES INSCRIPTIONS ==========

  async inscrire(utilisateurId: string, createInscriptionDto: CreateInscriptionDto) {
    const { evenementId, nombrePlaces = 1 } = createInscriptionDto;

    const evenement = await this.findOne(evenementId);

    // Vérifier la capacité
    if (evenement.capaciteMax) {
      const inscriptionsCount = await this.prisma.inscriptionEvenement.aggregate({
        where: { evenementId },
        _sum: { nombrePlaces: true }
      });

      const totalPlaces = inscriptionsCount._sum.nombrePlaces || 0;

      if (totalPlaces + nombrePlaces > evenement.capaciteMax) {
        throw new BadRequestException('Capacité maximale atteinte');
      }
    }

    // Vérifier si déjà inscrit
    const existingInscription = await this.prisma.inscriptionEvenement.findUnique({
      where: {
        evenementId_utilisateurId: {
          evenementId,
          utilisateurId
        }
      }
    });

    if (existingInscription) {
      throw new BadRequestException('Vous êtes déjà inscrit à cet événement');
    }

    return this.prisma.inscriptionEvenement.create({
      data: {
        evenementId,
        utilisateurId,
        nombrePlaces
      },
      include: {
        evenement: true,
        utilisateur: {
          select: {
            id: true,
            nom: true,
            email: true
          }
        }
      }
    });
  }

  async desinscrire(utilisateurId: string, evenementId: string) {
    const inscription = await this.prisma.inscriptionEvenement.findUnique({
      where: {
        evenementId_utilisateurId: {
          evenementId,
          utilisateurId
        }
      }
    });

    if (!inscription) {
      throw new NotFoundException('Inscription non trouvée');
    }

    return this.prisma.inscriptionEvenement.delete({
      where: {
        evenementId_utilisateurId: {
          evenementId,
          utilisateurId
        }
      }
    });
  }

  async getInscriptions(evenementId: string) {
    await this.findOne(evenementId);

    return this.prisma.inscriptionEvenement.findMany({
      where: { evenementId },
      include: {
        utilisateur: {
          select: {
            id: true,
            nom: true,
            email: true
          }
        }
      },
      orderBy: { dateInscrit: 'desc' }
    });
  }

  async getMesInscriptions(utilisateurId: string) {
    return this.prisma.inscriptionEvenement.findMany({
      where: { utilisateurId },
      include: {
        evenement: true
      },
      orderBy: { dateInscrit: 'desc' }
    });
  }

  // ========== STATISTIQUES ==========

  async getStatistiques() {
    const [total, aVenir, enCours, termines, populaires] = await Promise.all([
      this.prisma.evenement.count(),
      this.prisma.evenement.count({ where: { statut: 'A_VENIR' } }),
      this.prisma.evenement.count({ where: { statut: 'EN_COURS' } }),
      this.prisma.evenement.count({ where: { statut: 'TERMINE' } }),
      this.prisma.evenement.count({ where: { estPopulaire: true } })
    ]);

    return {
      total,
      aVenir,
      enCours,
      termines,
      populaires
    };
  }
}
