import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UtilisateursService } from './utilisateur.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { LoginUtilisateurDto } from './dto/login-utilisateur.dto';
import { UtilisateurEntity } from './entities/utilisateur.entity';

@ApiTags('utilisateurs')
@Controller('utilisateurs')
@UseInterceptors(ClassSerializerInterceptor)
export class UtilisateursController {
  constructor(private readonly utilisateursService: UtilisateursService) {}

  @Post('register')
  @ApiOperation({ summary: 'Créer un nouveau compte utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès', type: UtilisateurEntity })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  async create(@Body() createUtilisateurDto: CreateUtilisateurDto) {
    return new UtilisateurEntity(await this.utilisateursService.create(createUtilisateurDto));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiResponse({ status: 200, description: 'Connexion réussie', type: UtilisateurEntity })
  @ApiResponse({ status: 401, description: 'Identifiants incorrects' })
  async login(@Body() loginUtilisateurDto: LoginUtilisateurDto) {
    return new UtilisateurEntity(await this.utilisateursService.login(loginUtilisateurDto));
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs', type: [UtilisateurEntity] })
  async findAll() {
    const utilisateurs = await this.utilisateursService.findAll();
    return utilisateurs.map(user => new UtilisateurEntity(user));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur (UUID)' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé', type: UtilisateurEntity })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable' })
  async findOne(@Param('id') id: string) {
    return new UtilisateurEntity(await this.utilisateursService.findOne(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur (UUID)' })
  @ApiResponse({ status: 200, description: 'Utilisateur mis à jour', type: UtilisateurEntity })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable' })
  async update(@Param('id') id: string, @Body() updateUtilisateurDto: UpdateUtilisateurDto) {
    return new UtilisateurEntity(await this.utilisateursService.update(id, updateUtilisateurDto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur (UUID)' })
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé' })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable' })
  remove(@Param('id') id: string) {
    return this.utilisateursService.remove(id);
  }

  @Get(':id/favoris')
  @ApiOperation({ summary: 'Récupérer les favoris d\'un utilisateur' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur (UUID)' })
  @ApiResponse({ status: 200, description: 'Liste des favoris' })
  getFavoris(@Param('id') id: string) {
    return this.utilisateursService.getFavoris(id);
  }

  @Get(':id/historique')
  @ApiOperation({ summary: 'Récupérer l\'historique d\'un utilisateur' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur (UUID)' })
  @ApiResponse({ status: 200, description: 'Historique de consultation' })
  getHistorique(@Param('id') id: string) {
    return this.utilisateursService.getHistorique(id);
  }

  @Delete(':id/historique')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Effacer l\'historique d\'un utilisateur' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur (UUID)' })
  @ApiResponse({ status: 200, description: 'Historique effacé' })
  clearHistorique(@Param('id') id: string) {
    return this.utilisateursService.clearHistorique(id);
  }
}