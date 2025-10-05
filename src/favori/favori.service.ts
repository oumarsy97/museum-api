import { Injectable } from '@nestjs/common';
import { CreateFavoriDto } from './dto/create-favori.dto';
import { UpdateFavoriDto } from './dto/update-favori.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriService {
  constructor(private prisma: PrismaService) {}
  async create(createFavoriDto: CreateFavoriDto) {
    //verifier si la favori existe de le supprimer
    const favori = await this.prisma.favori.findUnique({
      where: {
        utilisateurId_oeuvreId: {
          oeuvreId: createFavoriDto.oeuvreId,
          utilisateurId: createFavoriDto.utilisateurId,
        },
      },
    })
    if ( favori) {
      return this.prisma.favori.delete({
        where: {
          utilisateurId_oeuvreId: {
            oeuvreId: createFavoriDto.oeuvreId,
            utilisateurId: createFavoriDto.utilisateurId,
          }
        },
      });
      return null;
    } else {
      return this.prisma.favori.create({
        data: {
          utilisateurId: createFavoriDto.utilisateurId,
          oeuvreId: createFavoriDto.oeuvreId,
          createdAt: createFavoriDto.createdAt,
        },
      });
    }

  }

  findAll() {
    return this.prisma.favori.findMany();
  }

  findOne(id: string) {
    return this.prisma.favori.findUnique({
      where: { id },
    });
  }

  update(id: string, updateFavoriDto: UpdateFavoriDto) {
    return this.prisma.favori.update({
      where: { id },
      data: {
        utilisateurId: updateFavoriDto.utilisateurId,
        oeuvreId: updateFavoriDto.oeuvreId,
        createdAt: updateFavoriDto.createdAt,
      },
    });
  }

  remove(id: string) {
    return this.prisma.favori.delete({
      where: { id },
    });
  }

  //favoris de user connecte
  async getFavorisByUser(utilisateurId: string) {
    return this.prisma.favori.findMany({
      where: { utilisateurId },
      include: { oeuvre: true },
    });
  }
}
