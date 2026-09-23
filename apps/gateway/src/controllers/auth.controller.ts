import { Controller, Post, Body, UseGuards, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { LoginDto } from '../dto/auth/login.dto.js';
import { RefreshTokenDto } from '../dto/auth/refresh-token.dto.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'auth.login' }, loginDto).pipe(timeout(5000)),
    );
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshTokenDto) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'auth.refresh' }, body).pipe(timeout(5000)),
    );
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Body() body: RefreshTokenDto, @CurrentUser() user: any) {
    return firstValueFrom(
      this.authClient
        .send(
          { cmd: 'auth.logout' },
          { refreshToken: body.refreshToken, jti: user.jti, exp: user.exp },
        )
        .pipe(timeout(5000)),
    );
  }

  @Post('revoke-all')
  @UseGuards(AuthGuard)
  async revokeAll(@CurrentUser() user: any) {
    return firstValueFrom(
      this.authClient
        .send(
          { cmd: 'auth.revokeAll' },
          { userId: user.sub, jti: user.jti, exp: user.exp },
        )
        .pipe(timeout(5000)),
    );
  }
}
