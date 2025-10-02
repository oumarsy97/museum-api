// favori.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FavoriService } from './favori.service';
import { FavoriController } from './favori.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtHelperService } from './../JwtHelper.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'votre_secret_key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [FavoriController],
  providers: [FavoriService, PrismaService, JwtHelperService],
  exports: [JwtHelperService],
})
export class FavoriModule {}