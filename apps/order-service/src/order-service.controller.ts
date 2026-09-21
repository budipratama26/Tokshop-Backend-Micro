import { Controller, Get } from '@nestjs/common';
import { OrderServiceService } from './order-service.service.js';

@Controller()
export class OrderServiceController {
  constructor(private readonly orderServiceService: OrderServiceService) {}

  @Get()
  getHello(): string {
    return this.orderServiceService.getHello();
  }
}
