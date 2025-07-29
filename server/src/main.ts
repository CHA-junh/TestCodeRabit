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

// ?�경변???�일 로드 (.env.development ?�선)
dotenv.config({ path: '.env.development' });
dotenv.config({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // DB 커넥???� 초기??(?�영/개발 모두)
  // (NestJS ?�이?�사?�클??맡기므�?직접 ?�출?��? ?�음)

  // ?�� 보안 ?�더 ?�정 (Helmet)
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

  // ?�� Rate Limiting ?�정 (??관?�?�게 조정)
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1�?
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000'), // IP??최�? ?�청 ??(1000개로 증�?)
    message: {
      error: '?�무 많�? ?�청??발생?�습?�다. ?�시 ???�시 ?�도?�주?�요.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // ?�공???�청?� 카운?�하지 ?�음
    skipFailedRequests: false, // ?�패???�청?� 카운??
  });
  app.use(limiter);

  // ?�� 보안 강화???�션 ?�정 (메모�??�?�소 + 강제 무효??
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
    // ?�션 무효??강화
    unset: 'destroy',
    rolling: true,
  };

  // 로컬 ?�경?�서 ?�션 ?�정
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    sessionConfig.cookie.maxAge = 30 * 60 * 1000; // 30분으�??�축
  }

  app.use(session(sessionConfig));

  // ?�� ?�역 캐시 방�? 미들?�어 (모든 ?�답??캐시 무효???�더 추�?)
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

  // ?�� ?�역 ?�터?�터 ?�용
  app.useGlobalInterceptors(new LoggingInterceptor());

  // ?�� ?�역 ?�외 ?�터 ?�용
  app.useGlobalFilters(new HttpExceptionFilter());

  // ?�� ?�역 Validation Pipe ?�정 (보안 강화)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production', // ?�영?�경?�서???�러 메시지 비활?�화
    }),
  );

  // Swagger ?�정
  const config = new DocumentBuilder()
    .setTitle('BIST API')
    .setDescription('BIST ?�버 API 문서')
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

  // ?�� 보안 강화??CORS ?�정 (로컬/개발�?모두 지??
  let allowedOrigins: string[] = [];
  if (process.env.ALLOWED_ORIGINS) {
    allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map((origin) =>
      origin.trim(),
    );
  } else {
    // ?�경변???�으�?기본�? 로컬, 개발�?IP
    allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://172.20.30.176:3000',
    ];
  }
  console.log('?�� CORS ?�용 Origin:', allowedOrigins);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
  });

  // ?�버 부???�점??OracleService ?�스?�스 강제 ?�성 (onModuleInit?� NestJS가 ?�동 ?�출)
  app.get(OracleService);

  const port = process.env.PORT || 8080;
  const host =
    process.env.NODE_ENV === 'development'
      ? process.env.DEV_SERVER_IP || '0.0.0.0'
      : 'localhost';
  await app.listen(port, host);

  console.log(`?? ?�버가 http://${host}:${port} ?�서 ?�행 중입?�다.`);
}
bootstrap();



