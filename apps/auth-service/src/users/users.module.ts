import { Module, Global } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { AuditLog } from '../common/entities/audit-log.entity.js';
import { AuditLogService } from '../common/audit-log.service.js';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, AuditLog])],
  providers: [UsersService, AuditLogService],
  exports: [UsersService, AuditLogService],
})
export class UsersModule {}
