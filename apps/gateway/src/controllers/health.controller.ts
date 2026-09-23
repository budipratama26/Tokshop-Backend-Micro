import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { time } from 'console';
import { firstValueFrom, timeout, catchError, of } from 'rxjs';

@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,

    @Inject('PRODUCT_SERVICE')
    private readonly productClient: ClientProxy,

    @Inject('ORDER_SERVICE')
    private readonly orderClient: ClientProxy,
  ) {}
  @Get()
  async checkAll() {
    const check = (client: ClientProxy) =>
      firstValueFrom(
        client.send({ cmd: 'health' }, {}).pipe(
          timeout(3000),
          catchError(() => of({ status: 'down' })),
        ),
      );
    const [authService, productService, orderService] = await Promise.all([
      check(this.authClient),
      check(this.productClient),
      check(this.orderClient),
    ]);
    return {
      gateway: { status: 'ok' },
      authService,
      productService,
      orderService,
    };
  }
}
