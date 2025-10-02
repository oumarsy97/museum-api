// oeuvre.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOeuvreDto, UpdateOeuvreDto } from './dto/create-oeuvre.dto';
import { CloudnaryService } from 'src/service/cloudnary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Langue, TypeMedia } from 'generated/prisma/';

@Injectable()
export class OeuvreService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudnaryService,
  ) {}

  async create(
    dto: CreateOeuvreDto,
    image: Express.Multer.File,
    medias?: Express.Multer.File[],
  ) {
    // Upload image principale
    const imageResult = await this.cloudinary.uploadImage(image);

    // Upload médias supplémentaires
    const mediaUrls: { type: TypeMedia; url: string }[] = [];
    if (medias?.length) {
      for (const media of medias) {
        // Utiliser uploadMedia au lieu de uploadImage pour gérer vidéos/audio
        const result = await this.uploadMedia(media);
        mediaUrls.push({
          type: this.getMediaType(media.mimetype),
          url: result.secure_url,
        });
      }
    }

    // Parser les descriptions si elles sont en string
    const descriptions = typeof dto.descriptions === 'string' 
      ? JSON.parse(dto.descriptions)
      : dto.descriptions;

    const oeuvre = await this.prisma.oeuvre.create({
      data: {
        titre: dto.titre,
        qrCode: dto.qrCode,
        artiste: dto.artiste,
        annee: dto.annee,
        localisation: dto.localisation,
        imageUrl: imageResult.secure_url,
        categorie: dto.categorie,
        // Créer les descriptions directement avec l'oeuvre
        descriptions: descriptions?.length ? {
          create: descriptions.map(desc => ({
            langue: desc.langue,
            texte: desc.texte,
          }))
        } : undefined,
        // Créer les médias
        medias: mediaUrls.length ? { create: mediaUrls } : undefined,
      },
      include: {
        descriptions: true,
        medias: true,
      },
    });

    return oeuvre;
  }

  async findAll(langue?: string) {
    const langueEnum = langue ? (langue.toUpperCase() as Langue) : undefined;

    return this.prisma.oeuvre.findMany({
      include: {
        descriptions: langueEnum ? { where: { langue: langueEnum } } : true,
        medias: true,
      },
    });
  }

  async findOne(id: string, langue?: string) {
    const langueEnum = langue ? (langue.toUpperCase() as Langue) : undefined;

    const oeuvre = await this.prisma.oeuvre.findUnique({
      where: { id },
      include: {
        descriptions: langueEnum ? { where: { langue: langueEnum } } : true,
        medias: true,
      },
    });

    if (!oeuvre) {
      throw new NotFoundException('Oeuvre non trouvée');
    }

    return oeuvre;
  }

  async getByQrCode(qrCode: string, langue?: string) {
    const langueEnum = (langue?.toUpperCase() as Langue) || Langue.FR;

    const oeuvre = await this.prisma.oeuvre.findUnique({
      where: { qrCode },
      include: {
        descriptions: { where: { langue: langueEnum } },
        medias: true,
      },
    });

    if (!oeuvre) {
      throw new NotFoundException('Oeuvre non trouvée');
    }

    return oeuvre;
  }

  async update(
    id: string, 
    dto: UpdateOeuvreDto, 
    image?: Express.Multer.File,
    medias?: Express.Multer.File[]
  ) {
    const oeuvre = await this.prisma.oeuvre.findUnique({ where: { id } });
    if (!oeuvre) throw new NotFoundException('Oeuvre non trouvée');

    let imageUrl = oeuvre.imageUrl;
    if (image) {
      const result = await this.cloudinary.uploadImage(image);
      imageUrl = result.secure_url;
    }

    // Upload nouveaux médias si fournis
    const mediaUrls: { type: TypeMedia; url: string }[] = [];
    if (medias?.length) {
      for (const media of medias) {
        // Utiliser uploadMedia pour gérer tous types de fichiers
        const result = await this.uploadMedia(media);
        mediaUrls.push({
          type: this.getMediaType(media.mimetype),
          url: result.secure_url,
        });
      }
    }

    return this.prisma.oeuvre.update({
      where: { id },
      data: {
        titre: dto.titre,
        qrCode: dto.qrCode,
        imageUrl,
        categorie: dto.categorie,
        // Ajouter les nouveaux médias sans supprimer les anciens
        medias: mediaUrls.length ? {
          create: mediaUrls
        } : undefined,
      },
      include: {
        descriptions: true,
        medias: true,
      },
    });
  }

  async delete(id: string) {
    const oeuvre = await this.prisma.oeuvre.findUnique({ where: { id } });
    if (!oeuvre) throw new NotFoundException('Oeuvre non trouvée');

    // Les descriptions et médias seront supprimés automatiquement grâce à onDelete: Cascade
    return this.prisma.oeuvre.delete({ where: { id } });
  }

  // Méthode pour mettre à jour les descriptions d'une oeuvre
  async updateDescriptions(
    oeuvreId: string,
    descriptions: { langue: Langue; texte: string }[]
  ) {
    const oeuvre = await this.prisma.oeuvre.findUnique({ where: { id: oeuvreId } });
    if (!oeuvre) throw new NotFoundException('Oeuvre non trouvée');

    // Supprimer les anciennes descriptions
    await this.prisma.description.deleteMany({
      where: { oeuvreId }
    });

    // Créer les nouvelles descriptions
    await this.prisma.description.createMany({
      data: descriptions.map(desc => ({
        oeuvreId,
        langue: desc.langue,
        texte: desc.texte,
      }))
    });

    return this.findOne(oeuvreId);
  }

  // Méthode pour ajouter ou mettre à jour une description spécifique
  async upsertDescription(
    oeuvreId: string,
    langue: Langue,
    texte: string
  ) {
    const oeuvre = await this.prisma.oeuvre.findUnique({ where: { id: oeuvreId } });
    if (!oeuvre) throw new NotFoundException('Oeuvre non trouvée');

    return this.prisma.description.upsert({
      where: {
        oeuvreId_langue: {
          oeuvreId,
          langue
        }
      },
      update: { texte },
      create: {
        oeuvreId,
        langue,
        texte
      }
    });
  }

  private getMediaType(mimetype: string): TypeMedia {
    if (mimetype.startsWith('image/')) return TypeMedia.IMAGE;
    if (mimetype.startsWith('video/')) return TypeMedia.VIDEO;
    if (mimetype.startsWith('audio/')) return TypeMedia.AUDIO;
    return TypeMedia.IMAGE;
  }

  // Méthode pour uploader différents types de médias sur Cloudinary
  private async uploadMedia(file: Express.Multer.File) {
    const mimetype = file.mimetype;
    
    if (mimetype.startsWith('video/')) {
      // Upload vidéo avec resource_type: 'video'
      return await this.cloudinary.uploadVideo(file);
    } else if (mimetype.startsWith('audio/')) {
      // Upload audio avec resource_type: 'video' (Cloudinary traite audio comme video)
      return await this.cloudinary.uploadVideo(file);
    } else {
      // Upload image par défaut
      return await this.cloudinary.uploadImage(file);
    }
  }
}