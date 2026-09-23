import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token tidak ditemukan!');
    }
    const result = await firstValueFrom(
      this.authClient
        .send<{ valid: Boolean; user: any; error?: string }>(
          { cmd: 'auth.validateToken' },
          { token },
        )
        .pipe(timeout(5000)),
    );
    if (!result.valid) {
      throw new UnauthorizedException(result.error ?? 'Token tidak valid!');
    }
    (request as any).user = result.user;
    return true;
  }
  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
