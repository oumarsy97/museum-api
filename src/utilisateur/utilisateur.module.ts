import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UtilisateursService } from './utilisateur.service';
import { UtilisateursController } from './utilisateur.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule],
  controllers: [UtilisateursController],
  providers: [UtilisateursService],
  exports: [UtilisateursService],
})
export class UtilisateursModule {}