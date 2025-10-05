import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilisateursModule } from './utilisateur/utilisateur.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { OeuvreModule } from './oeuvre/oeuvre.module';
import { DescriptionModule } from './description/description.module';
import { FavoriModule } from './favori/favori.module';
import { QrCodeController } from './qrcode.controller';
import { EvenementsModule } from './evenements/evenements.module';

@Module({
  imports: [UtilisateursModule, AuthModule, PrismaModule, OeuvreModule, DescriptionModule, FavoriModule, EvenementsModule],
  controllers: [AppController, QrCodeController],
  providers: [AppService],
})
export class AppModule {}
