import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/door_locker/');
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
