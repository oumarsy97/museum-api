// src/prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Optionnel: rend le module disponible partout sans l'importer explicitement
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // N'oubliez pas d'exporter le service
})
export class PrismaModule {}