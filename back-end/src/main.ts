import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap(): Promise<void> {
  const PORT = Number(process.env.PORT) ?? 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.use(cookieParser());
  app.use(
    session({
      secret: String(process.env.PRIVATE_KEY),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 86400000, // 24 hours
        signed: true,
      },
    }),
  );

  await app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}
bootstrap();
