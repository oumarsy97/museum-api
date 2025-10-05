// src/collections/collection.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudnaryService } from 'src/service/cloudnary.service';
import { CreateCollectionDto, UpdateCollectionDto } from './dto/create-collection.dto';
@Injectable()
export class CollectionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudnaryService,
  ) {}

  // Créer une collection
  async create(
    createDto: CreateCollectionDto,
    imageFile?: Express.Multer.File,
  ) {
    try {
      let imageUrl: string | undefined;

      // Upload image si fournie
      if (imageFile) {
        const uploadResult = await this.cloudinary.uploadImage(imageFile);
        imageUrl = uploadResult.secure_url;
      }

      const collection = await this.prisma.collection.create({
        data: {
          nom: createDto.nom,
          description: createDto.description,
          theme: createDto.theme,
          imageUrl,
          estPermanente: createDto.estPermanente ?? true,
        },
        include: {
          oeuvres: true,
        },
      });

      return {
        ...collection,
        nombreOeuvres: collection.oeuvres.length,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la création de la collection',
      );
    }
  }

  // Récupérer toutes les collections
  async findAll(includeOeuvres: boolean = true) {
    try {
      const collections = await this.prisma.collection.findMany({
        include: {
          oeuvres: includeOeuvres,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return collections.map((collection) => ({
        ...collection,
        nombreOeuvres: collection.oeuvres.length,
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des collections',
      );
    }
  }

  // Récupérer une collection par ID
  async findOne(id: string) {
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { id },
        include: {
          oeuvres: {
            include: {
              descriptions: true,
              medias: true,
            },
          },
        },
      });

      if (!collection) {
        throw new NotFoundException(`Collection avec l'ID ${id} introuvable`);
      }

      return {
        ...collection,
        nombreOeuvres: collection.oeuvres.length,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erreur lors de la récupération de la collection',
      );
    }
  }

  // Récupérer les collections permanentes
  async findPermanentes() {
    try {
      const collections = await this.prisma.collection.findMany({
        where: {
          estPermanente: true,
        },
        include: {
          oeuvres: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return collections.map((collection) => ({
        ...collection,
        nombreOeuvres: collection.oeuvres.length,
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des collections permanentes',
      );
    }
  }

  // Mettre à jour une collection
  async update(
    id: string,
    updateDto: UpdateCollectionDto,
    imageFile?: Express.Multer.File,
  ) {
    try {
      // Vérifier que la collection existe
      const existingCollection = await this.prisma.collection.findUnique({
        where: { id },
      });

      if (!existingCollection) {
        throw new NotFoundException(`Collection avec l'ID ${id} introuvable`);
      }

      let imageUrl = existingCollection.imageUrl;

      // Upload nouvelle image si fournie
      if (imageFile) {
        // Supprimer l'ancienne image si elle existe
        if (existingCollection.imageUrl) {
          const publicId = this.extractPublicId(existingCollection.imageUrl);
          await this.cloudinary.deleteFile(publicId, 'image');
        }

        const uploadResult = await this.cloudinary.uploadImage(imageFile);
        imageUrl = uploadResult.secure_url;
      }

      const collection = await this.prisma.collection.update({
        where: { id },
        data: {
          nom: updateDto.nom,
          description: updateDto.description,
          theme: updateDto.theme,
          imageUrl,
          estPermanente: updateDto.estPermanente,
   
        },
        include: {
          oeuvres: true,
        },
      });

      return {
        ...collection,
        nombreOeuvres: collection.oeuvres.length,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erreur lors de la mise à jour de la collection',
      );
    }
  }

  // Supprimer une collection
  async remove(id: string) {
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { id },
      });

      if (!collection) {
        throw new NotFoundException(`Collection avec l'ID ${id} introuvable`);
      }

      // Supprimer l'image de Cloudinary si elle existe
      if (collection.imageUrl) {
        const publicId = this.extractPublicId(collection.imageUrl);
        await this.cloudinary.deleteFile(publicId, 'image');
      }

      await this.prisma.collection.delete({
        where: { id },
      });

      return {
        message: 'Collection supprimée avec succès',
        id,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erreur lors de la suppression de la collection',
      );
    }
  }

  // Ajouter une œuvre à une collection
  async addOeuvre(collectionId: string, oeuvreId: string) {
    try {
      // Vérifier que la collection existe
      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId },
      });

      if (!collection) {
        throw new NotFoundException(
          `Collection avec l'ID ${collectionId} introuvable`,
        );
      }

      // Vérifier que l'œuvre existe
      const oeuvre = await this.prisma.oeuvre.findUnique({
        where: { id: oeuvreId },
      });

      if (!oeuvre) {
        throw new NotFoundException(`Œuvre avec l'ID ${oeuvreId} introuvable`);
      }

      // Ajouter l'œuvre à la collection
      await this.prisma.oeuvre.update({
        where: { id: oeuvreId },
        data: {
          collectionId: collectionId,
        },
      });

      return {
        message: 'Œuvre ajoutée à la collection avec succès',
        collectionId,
        oeuvreId,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Erreur lors de l'ajout de l'œuvre à la collection",
      );
    }
  }

  // Retirer une œuvre d'une collection
  async removeOeuvre(collectionId: string, oeuvreId: string) {
    try {
      const oeuvre = await this.prisma.oeuvre.findUnique({
        where: { id: oeuvreId },
      });

      if (!oeuvre) {
        throw new NotFoundException(`Œuvre avec l'ID ${oeuvreId} introuvable`);
      }

      if (oeuvre.collectionId !== collectionId) {
        throw new BadRequestException(
          "L'œuvre n'appartient pas à cette collection",
        );
      }

      await this.prisma.oeuvre.update({
        where: { id: oeuvreId },
        data: {
          collectionId: null,
        },
      });

      return {
        message: 'Œuvre retirée de la collection avec succès',
        collectionId,
        oeuvreId,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Erreur lors du retrait de l'œuvre de la collection",
      );
    }
  }

  // Méthode utilitaire pour extraire le public_id de Cloudinary
  private extractPublicId(url: string): string {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
  }
}