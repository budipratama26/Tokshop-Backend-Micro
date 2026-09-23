import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth/auth.service.js';
import { LoginDto } from './auth/dto/login.dto.js';
import { RefreshTokenDto } from './auth/dto/refresh-token.dto.js';
import { JwtService } from '@nestjs/jwt';
import { TokenBlacklistService } from './auth/token-blacklist.service.js';
import { CreateUserDto } from './users/dto/create-user.dto.js';
import { UpdateUserDto } from './users/dto/update-user.dto.js';
import { UsersService } from './users/users.service.js';

@Controller()
export class AuthServiceController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly jwtService: JwtService,
  ) {}

  @MessagePattern({ cmd: 'health' })
  health() {
    return { status: 'ok', service: 'auth-service' };
  }

  @MessagePattern({ cmd: 'auth.login' })
  login(data: LoginDto) {
    return this.authService.login(data);
  }

  @MessagePattern({ cmd: 'auth.refresh' })
  refresh(data: RefreshTokenDto) {
    return this.authService.refresh(data.refreshToken);
  }

  @MessagePattern({ cmd: 'auth.logout' })
  logout(data: { refreshToken: string; jti?: string; exp?: number }) {
    return this.authService.logout(data.refreshToken, data.jti, data.exp);
  }

  @MessagePattern({ cmd: 'auth.revokeAll' })
  async revokeAll(data: { userId: number; jti?: string; exp?: number }) {
    await this.authService.revokeAllforUser(data.userId, data.jti, data.exp);
    return { message: 'Semua sesi berhasil di revoke!' };
  }

  @MessagePattern({ cmd: 'auth.validateToken' })
  async validateToken(data: { token: string }) {
    try {
      const payload = await this.jwtService.verifyAsync(data.token);

      if (payload.jti) {
        const blacklisted = await this.tokenBlacklistService.isBlacklisted(
          payload.jti,
        );
        if (blacklisted) {
          return { valid: false, error: 'Token telah di revoke' };
        }
      }
      return { valid: true, user: payload };
    } catch {
      return { valid: false, error: 'Token tidak valid' };
    }
  }
  @MessagePattern({ cmd: 'users.register' })
  register(data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @MessagePattern({ cmd: 'users.findAll' })
  findAllUsers() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'users.findOne' })
  findOneUser(data: { id: number }) {
    return this.usersService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'users.update' })
  updateUser(data: { id: number; dto: UpdateUserDto }) {
    return this.usersService.update(data.id, data.dto);
  }

  @MessagePattern({ cmd: 'users.remove' })
  removeUser(data: { id: number }) {
    return this.usersService.remove(data.id);
  }
}
