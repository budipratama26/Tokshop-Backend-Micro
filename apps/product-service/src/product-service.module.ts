import { Module } from '@nestjs/common';
import { ProductServiceController } from './product-service.controller.js';
import { ProductServiceService } from './product-service.service.js';

@Module({
  imports: [],
  controllers: [ProductServiceController],
  providers: [ProductServiceService],
})
export class ProductServiceModule {}
