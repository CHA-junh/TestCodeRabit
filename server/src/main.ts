import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session = require('express-session');
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { OracleService } from './database/database.provider';
import * as dotenv from 'dotenv';

// ?κ²½λ³???μΌ λ‘λ (.env.development ?°μ )
dotenv.config({ path: '.env.development' });
dotenv.config({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // DB μ»€λ₯??? μ΄κΈ°??(?΄μ/κ°λ° λͺ¨λ)
  // (NestJS ?Όμ΄?μ¬?΄ν΄??λ§‘κΈ°λ―λ‘?μ§μ  ?ΈμΆ?μ? ?μ)

  // ? λ³΄μ ?€λ ?€μ  (Helmet)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  // ? Rate Limiting ?€μ  (??κ΄??κ² μ‘°μ )
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1λΆ?
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000'), // IP??μ΅λ? ?μ²­ ??(1000κ°λ‘ μ¦κ?)
    message: {
      error: '?λ¬΄ λ§μ? ?μ²­??λ°μ?μ΅?λ€. ? μ ???€μ ?λ?΄μ£Ό?Έμ.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // ?±κ³΅???μ²­? μΉ΄μ΄?Ένμ§ ?μ
    skipFailedRequests: false, // ?€ν¨???μ²­? μΉ΄μ΄??
  });
  app.use(limiter);

  // ? λ³΄μ κ°ν???Έμ ?€μ  (λ©λͺ¨λ¦???₯μ + κ°μ  λ¬΄ν¨??
  const sessionConfig: any = {
    secret: process.env.SESSION_SECRET || 'bist-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE || '86400000'),
    },
    name: 'bist-session',
    // ?Έμ λ¬΄ν¨??κ°ν
    unset: 'destroy',
    rolling: true,
  };

  // λ‘μ»¬ ?κ²½?μ ?Έμ ?€μ 
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    sessionConfig.cookie.maxAge = 30 * 60 * 1000; // 30λΆμΌλ‘??¨μΆ
  }

  app.use(session(sessionConfig));

  // ? ?μ­ μΊμ λ°©μ? λ―Έλ€?¨μ΄ (λͺ¨λ  ?λ΅??μΊμ λ¬΄ν¨???€λ μΆκ?)
  app.use((req, res, next) => {
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, private',
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  app.setGlobalPrefix('api');

  // ? ?μ­ ?Έν°?ν° ?μ©
  app.useGlobalInterceptors(new LoggingInterceptor());

  // ? ?μ­ ?μΈ ?ν° ?μ©
  app.useGlobalFilters(new HttpExceptionFilter());

  // ? ?μ­ Validation Pipe ?€μ  (λ³΄μ κ°ν)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production', // ?΄μ?κ²½?μ???λ¬ λ©μμ§ λΉν?±ν
    }),
  );

  // Swagger ?€μ 
  const config = new DocumentBuilder()
    .setTitle('BIST API')
    .setDescription('BIST ?λ² API λ¬Έμ')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 3,
      defaultModelExpandDepth: 3,
    },
  });

  // ? λ³΄μ κ°ν??CORS ?€μ  (λ‘μ»¬/κ°λ°κ³?λͺ¨λ μ§??
  let allowedOrigins: string[] = [];
  if (process.env.ALLOWED_ORIGINS) {
    allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map((origin) =>
      origin.trim(),
    );
  } else {
    // ?κ²½λ³???μΌλ©?κΈ°λ³Έκ°? λ‘μ»¬, κ°λ°κ³?IP
    allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://172.20.30.176:3000',
    ];
  }
  console.log('? CORS ?μ© Origin:', allowedOrigins);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
  });

  // ?λ² λΆ???μ ??OracleService ?Έμ€?΄μ€ κ°μ  ?μ± (onModuleInit? NestJSκ° ?λ ?ΈμΆ)
  app.get(OracleService);

  const port = process.env.PORT || 8080;
  const host =
    process.env.NODE_ENV === 'development'
      ? process.env.DEV_SERVER_IP || '0.0.0.0'
      : 'localhost';
  await app.listen(port, host);

  console.log(`?? ?λ²κ° http://${host}:${port} ?μ ?€ν μ€μ?λ€.`);
}
bootstrap();



