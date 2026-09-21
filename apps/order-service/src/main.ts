import { NestFactory } from '@nestjs/core';
import { OrderServiceModule } from './order-service.module.js';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(OrderServiceModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3003,
    },
  });
  await app.listen();
}
await bootstrap();
