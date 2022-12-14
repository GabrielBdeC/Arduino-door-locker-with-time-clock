import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';
import helmet from 'helmet';

const API_DEFAULT_PORT = 3000;
const API_DEFAULT_PREFIX = '/api/door_locker';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.API_PREFIX || API_DEFAULT_PREFIX);
  app.use(helmet());
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors();
  await app.listen(process.env.API_PORT || API_DEFAULT_PORT);
}
bootstrap();
