import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const openApiConfig = new DocumentBuilder()
    .setTitle('JembaTech API')
    .setDescription('API para autenticación, evaluación de equipos y coordinación de cotizaciones.')
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('auth', 'Registro, sesión y perfil')
    .addTag('evaluations', 'Evaluación de compatibilidad')
    .addTag('quotes', 'Cotizaciones y coordinación')
    .build();
  const openApiDocument = () => SwaggerModule.createDocument(app, openApiConfig);
  SwaggerModule.setup('api/docs', app, openApiDocument, {
    jsonDocumentUrl: 'api/docs-json',
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
