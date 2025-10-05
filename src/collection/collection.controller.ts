// src/collections/collection.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseBoolPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CollectionService } from './collection.service';
import {
  CreateCollectionDto,
  UpdateCollectionDto,
  CollectionResponseDto,
} from './dto/create-collection.dto';

@ApiTags('Collections')
@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Créer une nouvelle collection' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nom: { type: 'string', example: 'Bronzes Royaux du Bénin' },
        description: {
          type: 'string',
          example: 'Une collection exceptionnelle de bronzes royaux',
        },
        theme: { type: 'string', example: 'Art royal du Bénin' },
        estPermanente: { type: 'boolean', example: true },
        dateCreation: { type: 'string', format: 'date-time' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image de la collection',
        },
      },
      required: ['nom', 'description', 'theme'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Collection créée avec succès',
    type: CollectionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 500, description: 'Erreur serveur' })
  async create(
    @Body() createDto: CreateCollectionDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.collectionService.create(createDto, image);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les collections' })
  @ApiQuery({
    name: 'includeOeuvres',
    required: false,
    type: Boolean,
    description: 'Inclure les œuvres dans la réponse',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des collections',
    type: [CollectionResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Erreur serveur' })
  async findAll(
    @Query('includeOeuvres', new ParseBoolPipe({ optional: true }))
    includeOeuvres?: boolean,
  ) {
    return this.collectionService.findAll(includeOeuvres);
  }

  @Get('permanentes')
  @ApiOperation({ summary: 'Récupérer les collections permanentes' })
  @ApiResponse({
    status: 200,
    description: 'Liste des collections permanentes',
    type: [CollectionResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Erreur serveur' })
  async findPermanentes() {
    return this.collectionService.findPermanentes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une collection par ID' })
  @ApiParam({ name: 'id', description: 'ID de la collection' })
  @ApiResponse({
    status: 200,
    description: 'Collection trouvée',
    type: CollectionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Collection introuvable' })
  @ApiResponse({ status: 500, description: 'Erreur serveur' })
  async findOne(@Param('id') id: string) {
    return this.collectionService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Mettre à jour une collection' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID de la collection' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nom: { type: 'string' },
        description: { type: 'string' },
        theme: { type: 'string' },
        estPermanente: { type: 'boolean' },
        dateCreation: { type: 'string', format: 'date-time' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Nouvelle image de la collection',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Collection mise à jour avec succès',
    type: CollectionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Collection introuvable' })
  @ApiResponse({ status: 500, description: 'Erreur serveur' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCollectionDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.collectionService.update(id, updateDto, image);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer une collection' })
  @ApiParam({ name: 'id', description: 'ID de la collection' })
  @ApiResponse({
    status: 200,
    description: 'Collection supprimée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Collection introuvable' })
  @ApiResponse({ status: 500, description: 'Erreur serveur' })
  async remove(@Param('id') id: string) {
    return this.collectionService.remove(id);
  }

  @Post(':collectionId/oeuvres/:oeuvreId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ajouter une œuvre à une collection' })
  @ApiParam({ name: 'collectionId', description: 'ID de la collection' })
  @ApiParam({ name: 'oeuvreId', description: "ID de l'œuvre" })
  @ApiResponse({
    status: 200,
    description: 'Œuvre ajoutée à la collection avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Collection ou œuvre introuvable',
  })
  @ApiResponse({ status: 500, description: 'Erreur serveur' })
  async addOeuvre(
    @Param('collectionId') collectionId: string,
    @Param('oeuvreId') oeuvreId: string,
  ) {
    return this.collectionService.addOeuvre(collectionId, oeuvreId);
  }

  @Delete(':collectionId/oeuvres/:oeuvreId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Retirer une œuvre d'une collection" })
  @ApiParam({ name: 'collectionId', description: 'ID de la collection' })
  @ApiParam({ name: 'oeuvreId', description: "ID de l'œuvre" })
  @ApiResponse({
    status: 200,
    description: 'Œuvre retirée de la collection avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Collection ou œuvre introuvable',
  })
  @ApiResponse({
    status: 400,
    description: "L'œuvre n'appartient pas à cette collection",
  })
  @ApiResponse({ status: 500, description: 'Erreur serveur' })
  async removeOeuvre(
    @Param('collectionId') collectionId: string,
    @Param('oeuvreId') oeuvreId: string,
  ) {
    return this.collectionService.removeOeuvre(collectionId, oeuvreId);
  }
}