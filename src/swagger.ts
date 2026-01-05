import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function initSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Weather API')
    .setDescription('previsão do tempo utilizando Open Weather API e Nest.Js')
    .setVersion('1.0')
    .addTag('weather')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);
}
