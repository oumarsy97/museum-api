// ============================================
// 📁 src/evenements/evenements.controller.ts
// ============================================
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes
} from '@nestjs/swagger';
import { EvenementsService } from './evenements.service';
import { CreateEvenementDto } from './dto/create-evenement.dto';
import { UpdateEvenementDto } from './dto/update-evenement.dto';
import { FilterEvenementDto } from './dto/filter-evenement.dto';
import { CreateInscriptionDto } from './dto/inscription.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Événements')
@Controller('evenements')
export class EvenementsController {
  constructor(private readonly evenementsService: EvenementsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel événement avec image' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Événement créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createEvenementDto: CreateEvenementDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.evenementsService.create(createEvenementDto, image);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les événements avec filtres' })
  @ApiResponse({ status: 200, description: 'Liste des événements récupérée' })
  findAll(@Query() filters: FilterEvenementDto) {
    return this.evenementsService.findAll(filters);
  }

  @Get('statistiques')
  @ApiOperation({ summary: 'Obtenir les statistiques des événements' })
  @ApiResponse({ status: 200, description: 'Statistiques récupérées' })
  getStatistiques() {
    return this.evenementsService.getStatistiques();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un événement par son ID' })
  @ApiParam({ name: 'id', description: 'ID de l\'événement' })
  @ApiResponse({ status: 200, description: 'Événement trouvé' })
  @ApiResponse({ status: 404, description: 'Événement non trouvé' })
  findOne(@Param('id') id: string) {
    return this.evenementsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un événement' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID de l\'événement' })
  @ApiResponse({ status: 200, description: 'Événement mis à jour' })
  @ApiResponse({ status: 404, description: 'Événement non trouvé' })
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateEvenementDto: UpdateEvenementDto,
    @UploadedFile() image?: Express.Multer.File
  ) {
    return this.evenementsService.update(id, updateEvenementDto, image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un événement' })
  @ApiParam({ name: 'id', description: 'ID de l\'événement' })
  @ApiResponse({ status: 200, description: 'Événement supprimé' })
  @ApiResponse({ status: 404, description: 'Événement non trouvé' })
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.evenementsService.remove(id);
  }

  // ========== INSCRIPTIONS ==========

  @Post('inscription')
  @ApiOperation({ summary: 'S\'inscrire à un événement' })
  @ApiResponse({ status: 201, description: 'Inscription réussie' })
  @ApiResponse({ status: 400, description: 'Capacité maximale atteinte ou déjà inscrit' })
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  inscrire(
    // @Request() req,
    @Body() createInscriptionDto: CreateInscriptionDto
  ) {
    // const utilisateurId = req.user.id;
    const utilisateurId = 'temp-user-id'; // TEMPORAIRE
    return this.evenementsService.inscrire(utilisateurId, createInscriptionDto);
  }

  @Delete(':evenementId/inscription')
  @ApiOperation({ summary: 'Se désinscrire d\'un événement' })
  @ApiParam({ name: 'evenementId', description: 'ID de l\'événement' })
  @ApiParam({ name: 'utilisateurId', description: 'ID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Désinscription réussie' })
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  desinscrire(
    @Param('evenementId') evenementId: string,
    @Param('utilisateurId') utilisateurId: string
    // @Request() req
  ) {
    // const utilisateurId = req.user.id;

    return this.evenementsService.desinscrire(utilisateurId, evenementId);
  }
  
  @Get(':id/inscriptions')
  @ApiOperation({ summary: 'Récupérer les inscriptions d\'un événement' })
  @ApiParam({ name: 'id', description: 'ID de l\'événement' })
  @ApiResponse({ status: 200, description: 'Liste des inscriptions' })
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  getInscriptions(@Param('id') id: string) {
    return this.evenementsService.getInscriptions(id);
  }

  @Get('user/mes-inscriptions')
  @ApiOperation({ summary: 'Récupérer mes inscriptions' })
  @ApiResponse({ status: 200, description: 'Liste de mes inscriptions' })
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  getMesInscriptions(
    // @Request() req
  ) {
    // const utilisateurId = req.user.id;
    const utilisateurId = 'temp-user-id'; // TEMPORAIRE
    return this.evenementsService.getMesInscriptions(utilisateurId);
  }
}
