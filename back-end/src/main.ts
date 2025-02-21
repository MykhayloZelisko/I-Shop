import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

async function bootstrap(): Promise<void> {
  const PORT = Number(process.env.PORT) || 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:4000'],
    credentials: true,
  });

  const redisClient = createClient({
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  });
  redisClient.on('error', (err) => console.error('Redis Client Error:', err));
  await redisClient.connect();
  const redisStore = new RedisStore({
    client: redisClient,
  });

  app.use(cookieParser(String(process.env.PRIVATE_KEY)));
  app.use(
    session({
      name: 'SESSION_ID',
      store: redisStore,
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
