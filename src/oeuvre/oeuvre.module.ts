import { Module } from '@nestjs/common';
import { OeuvreService } from './oeuvre.service';
import { OeuvreController } from './oeuvre.controller';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudnaryService } from 'src/service/cloudnary.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [OeuvreController],
  providers: [OeuvreService, PrismaService, CloudnaryService, ConfigService],
})
export class OeuvreModule {}
