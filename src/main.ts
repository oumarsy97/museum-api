/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // Appliquer l'intercepteur globalement
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  const config = new DocumentBuilder()
    .setTitle('Museum API')
    .setDescription('API pour la gestion multilingue des œuvres d\'art')
    .setVersion('1.0')
    .addTag('utilisateurs')
    .addTag('oeuvres')
    .addTag('collections')
    .addTag('favoris')
    .addTag('historique')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Chargé' : '✗ Non chargé');
  console.log('JWT_EXPIRATION:', process.env.JWT_EXPIRATION ? '✓ Chargé' : '✗ Non chargé');
  await app.listen(3000);
  console.log('API disponible sur http://localhost:3000');
  console.log('Documentation Swagger sur http://localhost:3000/api');
}
bootstrap();
