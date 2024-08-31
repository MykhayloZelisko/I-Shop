import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';

async function bootstrap(): Promise<void> {
  const PORT = Number(process.env.PORT) ?? 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });
  app.use(cookieParser(String(process.env.PRIVATE_KEY)));
  app.use(
    session({
      name: 'SESSION_ID',
      secret: String(process.env.PRIVATE_KEY),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 86400000, // 24 hours
        signed: true,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

  await app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}
bootstrap();
