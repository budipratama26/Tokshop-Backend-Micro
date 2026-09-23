import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module.js';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { RpcExceptionInterceptor } from './interceptors/rpc-exception.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new RpcExceptionInterceptor());

  const port = process.env.GATEWAY_PORT ?? 3000;
  await app.listen(port);
  console.log(`Gateway listening on http://localhost:${port}`);
}
await bootstrap();
