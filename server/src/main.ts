import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // access env variables
  const configService = app.get(ConfigService);
  const cookieSecret = configService.get<string>('COOKIE_SECRET');

  // middleware
  app.enableCors();

  app.use(cookieParser(cookieSecret, ));

  const port = process.env.PORT
  await app.listen(port);
}
bootstrap();
