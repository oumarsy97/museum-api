import { Module } from '@nestjs/common';
import { EvenementsService } from './evenements.service';
import { EvenementsController } from './evenements.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudnaryService } from 'src/service/cloudnary.service';

@Module({
  controllers: [EvenementsController],
  providers: [EvenementsService, PrismaService, CloudnaryService],
})
export class EvenementsModule {}
