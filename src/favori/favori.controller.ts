import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Request,
  UseGuards
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiBody
} from '@nestjs/swagger';
import { FavoriService } from './favori.service';
import { CreateFavoriDto } from './dto/create-favori.dto';
import { UpdateFavoriDto } from './dto/update-favori.dto';
import { JwtHelperService } from './../JwtHelper.service';

@ApiTags('favoris')
@Controller('favori')
@ApiBearerAuth() // Ajoute l'authentification Bearer pour tous les endpoints
export class FavoriController {
  constructor(
    private readonly favoriService: FavoriService,
    private readonly jwtHelperService: JwtHelperService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau favori' })
  @ApiResponse({ status: 201, description: 'Favori créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiBody({ type: CreateFavoriDto })
  create(@Body() createFavoriDto: CreateFavoriDto, @Request() req) {
    // Extraire l'ID utilisateur du token
    const token = req.headers.authorization;
    const utilisateurId = this.jwtHelperService.extractUserIdFromToken(token);
    
    // Remplacer l'utilisateurId dans le DTO
    createFavoriDto.utilisateurId = utilisateurId;
    
    return this.favoriService.create(createFavoriDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les favoris' })
  @ApiResponse({ status: 200, description: 'Liste des favoris récupérée' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  findAll() {
    return this.favoriService.findAll();
  }

  @Get('user/me')
  @ApiOperation({ summary: 'Récupérer les favoris de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Favoris de l\'utilisateur récupérés' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  getFavorisByConnectedUser(@Request() req) {
    const token = req.headers.authorization;
    const utilisateurId = this.jwtHelperService.extractUserIdFromToken(token);
    return this.favoriService.getFavorisByUser(utilisateurId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un favori par ID' })
  @ApiParam({ name: 'id', description: 'ID du favori' })
  @ApiResponse({ status: 200, description: 'Favori trouvé' })
  @ApiResponse({ status: 404, description: 'Favori non trouvé' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  findOne(@Param('id') id: string) {
    return this.favoriService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un favori' })
  @ApiParam({ name: 'id', description: 'ID du favori' })
  @ApiBody({ type: UpdateFavoriDto })
  @ApiResponse({ status: 200, description: 'Favori mis à jour' })
  @ApiResponse({ status: 404, description: 'Favori non trouvé' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  update(@Param('id') id: string, @Body() updateFavoriDto: UpdateFavoriDto) {
    return this.favoriService.update(id, updateFavoriDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un favori' })
  @ApiParam({ name: 'id', description: 'ID du favori' })
  @ApiResponse({ status: 200, description: 'Favori supprimé' })
  @ApiResponse({ status: 404, description: 'Favori non trouvé' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  remove(@Param('id') id: string) {
    return this.favoriService.remove(id);
  }
}