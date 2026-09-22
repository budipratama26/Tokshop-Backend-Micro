import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class GatewayController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,

    @Inject('PRODUCT_SERVICE')
    private readonly productClient: ClientProxy,

    @Inject('ORDER_SERVICE')
    private readonly orderClient: ClientProxy,
  ) {}

  @Get('auth/health')
  checkAuthService() {
    return this.authClient.send({ cmd: 'health' }, {});
  }

  @Get('products/health')
  checkProductService() {
    return this.productClient.send({ cmd: 'health' }, {});
  }

  @Get('orders/health')
  checkOrderService() {
    return this.orderClient.send({ cmd: 'health' }, {});
  }
}
