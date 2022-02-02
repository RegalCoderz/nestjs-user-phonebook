import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  /* =========== NestJS App Configuration Started =========== */

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  /* =========== Swagger Configuration Started =========== */

  const config = new DocumentBuilder()
    .setTitle('Phonebook API')
    .setDescription('users phonebook example')
    .setVersion('1.0')
    .addBearerAuth(
      {
        // I was also testing it without prefix 'Bearer ' before the JWT
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'JWT', // I`ve tested not to use this field, but the result was the same
        scheme: 'Bearer',
        type: 'http', // I`ve attempted type: 'apiKey' too
        in: 'Header',
      },
      'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  /* =========== Swagger Configuration Ended =========== */

  /* =========== Firebase SDK Configuration Started =========== */

  // Initialize Firebase
  // initializeApp(firebaseConfig);

  /* =========== Firebase SDK Configuration Ended =========== */

  // App Server Port
  await app.listen(3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
  /* =========== NestJS App Configuration Ended =========== */
}
bootstrap();
