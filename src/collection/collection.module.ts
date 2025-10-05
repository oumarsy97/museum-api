// src/collections/collection.module.ts
import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudnaryService } from 'src/service/cloudnary.service';

@Module({
  imports: [PrismaModule],
  controllers: [CollectionController],
  providers: [CollectionService, CloudnaryService],
  exports: [CollectionService],
})
export class CollectionModule {}