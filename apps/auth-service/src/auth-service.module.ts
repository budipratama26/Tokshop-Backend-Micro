import { Module } from '@nestjs/common';
import { User } from './users/entities/user.entity.js';
import { AuditLog } from './common/entities/audit-log.entity.js';
import { UsersModule } from './users/users.module.js';
import { RefreshToken } from './auth/entities/refresh-token.entity.js';
import { BlacklistedToken } from './auth/entities/blacklisted-token.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TokenBlacklistService } from './auth/token-blacklist.service.js';
import { AuthService } from './auth/auth.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ScheduleModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'auth.sqlite',
      entities: [User, RefreshToken, BlacklistedToken, AuditLog],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, RefreshToken, BlacklistedToken, AuditLog]),

    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    TokenBlacklistService,
  ],
  exports: [
    AuthService,
    TokenBlacklistService,
  ],
})
export class AuthServiceModule { }
