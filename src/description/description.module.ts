import { Module } from '@nestjs/common';
import { DescriptionService } from './description.service';
import { DescriptionController } from './description.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DescriptionController],
  providers: [DescriptionService, PrismaService],
})
export class DescriptionModule {}
