import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class OrderServiceController {
  @MessagePattern({ cmd: 'health' })
  health() {
    return {
      status: 'ok',
      service: 'order-service',
    };
  }
}
