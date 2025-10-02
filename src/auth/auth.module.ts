import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback-secret-key-changez-moi',
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '7d' 
        },
      }),
    }),
  ],
  providers: [JwtStrategy, ConfigService],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}