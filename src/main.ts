import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const HTTP_PORT = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Swapi API Docs')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs/api', app, document);

  await app.listen(HTTP_PORT);

  console.log(`Swapi api is running on ${await app.getUrl()}`);

  console.log(`Swapi API docs is running on ${await app.getUrl()}/docs/api`);
}
bootstrap();
