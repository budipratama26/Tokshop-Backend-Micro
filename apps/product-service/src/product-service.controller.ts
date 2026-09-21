import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ProductServiceController {
  @MessagePattern({ cmd: 'health' })
  health() {
    return {
      status: 'ok',
      service: 'product-service',
    };
  }
}