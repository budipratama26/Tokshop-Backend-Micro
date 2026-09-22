import { Module } from '@nestjs/common';
import { User } from './users/entities/user.entity.js';
import { AuditLog } from './common/entities/audit-log.entity.js';
import { UsersModule } from './users/users.module.js';
import { RefreshToken } from './auth/entities/refresh-token.entity.js';
import { BlacklistedToken } from './auth/entities/blacklisted-token.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TokenBlacklistedService } from './auth/token-blacklisted.service.js';

@Module({
  imports: [
    ScheduleModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'auth.sqlite',
      entities: [User, RefreshToken, BlacklistedToken, AuditLog],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, RefreshToken, BlacklistedToken, AuditLog]),
    UsersModule,
  ],
  providers: [
    TokenBlacklistedService,
  ],
})
export class AuthServiceModule {}
