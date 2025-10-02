// oeuvre.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { OeuvreService } from './oeuvre.service';
import { CreateOeuvreDto, UpdateOeuvreDto } from './dto/create-oeuvre.dto';
import { Langue } from 'generated/prisma';

@ApiTags('oeuvres')
@Controller('oeuvres')
export class OeuvreController {
  constructor(private readonly oeuvreService: OeuvreService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle oeuvre' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['titre', 'qrCode', 'categorie', 'artiste', 'localisation', 'annee', 'image'],
      properties: {
        titre: { type: 'string' },
        qrCode: { type: 'string' },
        categorie: { type: 'string' },
        artiste: { type: 'string' },
        localisation: { type: 'string' },
        annee: { type: 'number' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image principale de l\'oeuvre'
        },
        medias: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          },
          description: 'Médias supplémentaires (images, vidéos, audio)'
        },
        descriptions: {
          type: 'string',
          description: 'JSON des descriptions multilingues',
          example: JSON.stringify([
            { langue: 'FR', texte: 'Description en français' },
            { langue: 'EN', texte: 'Description in English' },
            { langue: 'WO', texte: 'Description en wolof' }
          ])
        }
      }
    }
  })
  @UseInterceptors(
    FileInterceptor('image'),
  )
  async create(
    @Body() dto: CreateOeuvreDto,
    @UploadedFile() image: Express.Multer.File,
    @UploadedFiles() medias?: Express.Multer.File[],
  ) {
    return this.oeuvreService.create(dto, image, medias);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les oeuvres' })
  @ApiQuery({ name: 'langue', enum: Langue, required: false })
  async findAll(@Query('langue') langue?: string) {
    return this.oeuvreService.findAll(langue);
  }

  @Get('qr/:qrCode')
  @ApiOperation({ summary: 'Récupérer une oeuvre par QR code' })
  @ApiParam({ name: 'qrCode', type: 'string' })
  @ApiQuery({ name: 'langue', enum: Langue, required: false })
  async getByQrCode(
    @Param('qrCode') qrCode: string,
    @Query('langue') langue?: string,
  ) {
    return this.oeuvreService.getByQrCode(qrCode, langue);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une oeuvre par ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'langue', enum: Langue, required: false })
  async findOne(
    @Param('id') id: string,
    @Query('langue') langue?: string,
  ) {
    return this.oeuvreService.findOne(id, langue);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une oeuvre' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        titre: { type: 'string' },
        qrCode: { type: 'string' },
        categorie: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Nouvelle image principale (optionnelle)'
        },
        medias: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          },
          description: 'Nouveaux médias à ajouter (optionnel)'
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOeuvreDto,
    @UploadedFile() image?: Express.Multer.File,
    @UploadedFiles() medias?: Express.Multer.File[],
  ) {
    return this.oeuvreService.update(id, dto, image, medias);
  }

  @Put(':id/descriptions')
  @ApiOperation({ summary: 'Mettre à jour les descriptions d\'une oeuvre' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['descriptions'],
      properties: {
        descriptions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              langue: { type: 'string', enum: ['FR', 'EN', 'WO'] },
              texte: { type: 'string' }
            }
          },
          example: [
            { langue: 'FR', texte: 'Description mise à jour en français' },
            { langue: 'EN', texte: 'Updated description in English' }
          ]
        }
      }
    }
  })
  async updateDescriptions(
    @Param('id') id: string,
    @Body('descriptions') descriptions: { langue: Langue; texte: string }[],
  ) {
    return this.oeuvreService.updateDescriptions(id, descriptions);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une oeuvre' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Oeuvre supprimée avec succès' })
  async delete(@Param('id') id: string) {
    return this.oeuvreService.delete(id);
  }
}