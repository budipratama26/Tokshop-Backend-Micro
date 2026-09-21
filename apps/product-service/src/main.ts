import { NestFactory } from '@nestjs/core';
import { ProductServiceModule } from './product-service.module.js';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ProductServiceModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3002,
    },
  });
  await app.listen();
}
await bootstrap();
