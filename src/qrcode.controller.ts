import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import express from 'express';
import { IsNotEmpty, IsString } from 'class-validator';
import * as QRCode from 'qrcode';

// DTO avec validation
export class QrCodeDto {
  @IsString()
  @IsNotEmpty({ message: 'La chaîne QR code ne peut pas être vide' })
  qrCodeString: string;
}

@ApiTags('QR Code')
@Controller('qrcode')
export class QrCodeController {
  @Post('generate')
  @ApiOperation({
    summary: 'Générer un QR code en image PNG',
    description: "Génère un QR code à partir d'une chaîne de caractères et le retourne au format PNG",
  })
  @ApiBody({
    description: 'Données pour générer le QR code',
    type: QrCodeDto,
    examples: {
      exemple1: {
        value: {
          qrCodeString: 'https://example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'QR code généré avec succès',
    content: {
      'image/png': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Données d'entrée invalides",
  })
  async generateQrCode(
    @Body() qrCodeDto: QrCodeDto,
    @Res() res: express.Response,
  ) {
    try {
      const { qrCodeString } = qrCodeDto;

      // Options du QR code
      const qrOptions = {
        type: 'png' as const,
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        width: 300,
      };

      // Générer le QR code
      const qrBuffer = await QRCode.toBuffer(qrCodeString, qrOptions);

      // Configurer la réponse
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'attachment; filename="qrcode.png"');
      res.setHeader('Content-Length', qrBuffer.length.toString());

      // Envoyer l'image
      res.send(qrBuffer);
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la génération du QR code',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}