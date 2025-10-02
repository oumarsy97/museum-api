import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtHelperService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Extrait l'ID utilisateur depuis le token JWT
   * @param token - Le token JWT
   * @returns L'ID de l'utilisateur
   */
  extractUserIdFromToken(token: string): string {
    try {
      // Enlever le préfixe "Bearer " s'il existe
      const cleanToken = token.replace(/^Bearer\s+/, '');
      
      // Décoder le token
      const payload = this.jwtService.decode(cleanToken) as any;
      
      if (!payload || (!payload.sub && !payload.id && !payload.userId)) {
        throw new Error('Token invalide: ID utilisateur non trouvé');
      }
      
      // Retourner l'ID utilisateur (peut être dans sub, id, ou userId selon votre implémentation)
      return payload.sub || payload.id || payload.userId;
    } catch (error) {
      throw new Error(`Erreur lors de l'extraction de l'ID utilisateur: ${error.message}`);
    }
  }

  /**
   * Extrait toutes les informations utilisateur depuis le token JWT
   * @param token - Le token JWT
   * @returns Le payload complet du token
   */
  extractUserDataFromToken(token: string): any {
    try {
      const cleanToken = token.replace(/^Bearer\s+/, '');
      const payload = this.jwtService.decode(cleanToken) as any;
      
      if (!payload) {
        throw new Error('Token invalide');
      }
      
      return payload;
    } catch (error) {
      throw new Error(`Erreur lors de l'extraction des données utilisateur: ${error.message}`);
    }
  }

  /**
   * Vérifie si le token est valide
   * @param token - Le token JWT
   * @returns true si le token est valide, false sinon
   */
  isTokenValid(token: string): boolean {
    try {
      const cleanToken = token.replace(/^Bearer\s+/, '');
      const payload = this.jwtService.decode(cleanToken);
      return !!payload;
    } catch (error) {
      return false;
    }
  }

  /**
   * Extrait le rôle utilisateur depuis le token JWT
   * @param token - Le token JWT
   * @returns Le rôle de l'utilisateur
   */
  extractUserRoleFromToken(token: string): string | null {
    try {
      const payload = this.extractUserDataFromToken(token);
      return payload.role || payload.roles || null;
    } catch (error) {
      return null;
    }
  }
}