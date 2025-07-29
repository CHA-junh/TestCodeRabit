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

// ?˜ê²½ë³€???Œì¼ ë¡œë“œ (.env.development ?°ì„ )
dotenv.config({ path: '.env.development' });
dotenv.config({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // DB ì»¤ë„¥???€ ì´ˆê¸°??(?´ì˜/ê°œë°œ ëª¨ë‘)
  // (NestJS ?¼ì´?„ì‚¬?´í´??ë§¡ê¸°ë¯€ë¡?ì§ì ‘ ?¸ì¶œ?˜ì? ?ŠìŒ)

  // ?”’ ë³´ì•ˆ ?¤ë” ?¤ì • (Helmet)
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

  // ?”’ Rate Limiting ?¤ì • (??ê´€?€?˜ê²Œ ì¡°ì •)
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1ë¶?
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000'), // IP??ìµœë? ?”ì²­ ??(1000ê°œë¡œ ì¦ê?)
    message: {
      error: '?ˆë¬´ ë§ì? ?”ì²­??ë°œìƒ?ˆìŠµ?ˆë‹¤. ? ì‹œ ???¤ì‹œ ?œë„?´ì£¼?¸ìš”.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // ?±ê³µ???”ì²­?€ ì¹´ìš´?¸í•˜ì§€ ?ŠìŒ
    skipFailedRequests: false, // ?¤íŒ¨???”ì²­?€ ì¹´ìš´??
  });
  app.use(limiter);

  // ?”’ ë³´ì•ˆ ê°•í™”???¸ì…˜ ?¤ì • (ë©”ëª¨ë¦??€?¥ì†Œ + ê°•ì œ ë¬´íš¨??
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
    // ?¸ì…˜ ë¬´íš¨??ê°•í™”
    unset: 'destroy',
    rolling: true,
  };

  // ë¡œì»¬ ?˜ê²½?ì„œ ?¸ì…˜ ?¤ì •
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    sessionConfig.cookie.maxAge = 30 * 60 * 1000; // 30ë¶„ìœ¼ë¡??¨ì¶•
  }

  app.use(session(sessionConfig));

  // ?”’ ?„ì—­ ìºì‹œ ë°©ì? ë¯¸ë“¤?¨ì–´ (ëª¨ë“  ?‘ë‹µ??ìºì‹œ ë¬´íš¨???¤ë” ì¶”ê?)
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

  // ?”’ ?„ì—­ ?¸í„°?‰í„° ?ìš©
  app.useGlobalInterceptors(new LoggingInterceptor());

  // ?”’ ?„ì—­ ?ˆì™¸ ?„í„° ?ìš©
  app.useGlobalFilters(new HttpExceptionFilter());

  // ?”’ ?„ì—­ Validation Pipe ?¤ì • (ë³´ì•ˆ ê°•í™”)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production', // ?´ì˜?˜ê²½?ì„œ???ëŸ¬ ë©”ì‹œì§€ ë¹„í™œ?±í™”
    }),
  );

  // Swagger ?¤ì •
  const config = new DocumentBuilder()
    .setTitle('BIST API')
    .setDescription('BIST ?œë²„ API ë¬¸ì„œ')
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

  // ?”’ ë³´ì•ˆ ê°•í™”??CORS ?¤ì • (ë¡œì»¬/ê°œë°œê³?ëª¨ë‘ ì§€??
  let allowedOrigins: string[] = [];
  if (process.env.ALLOWED_ORIGINS) {
    allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map((origin) =>
      origin.trim(),
    );
  } else {
    // ?˜ê²½ë³€???†ìœ¼ë©?ê¸°ë³¸ê°? ë¡œì»¬, ê°œë°œê³?IP
    allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://172.20.30.176:3000',
    ];
  }
  console.log('?”“ CORS ?ˆìš© Origin:', allowedOrigins);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
  });

  // ?œë²„ ë¶€???œì ??OracleService ?¸ìŠ¤?´ìŠ¤ ê°•ì œ ?ì„± (onModuleInit?€ NestJSê°€ ?ë™ ?¸ì¶œ)
  app.get(OracleService);

  const port = process.env.PORT || 8080;
  const host =
    process.env.NODE_ENV === 'development'
      ? process.env.DEV_SERVER_IP || '0.0.0.0'
      : 'localhost';
  await app.listen(port, host);

  console.log(`?? ?œë²„ê°€ http://${host}:${port} ?ì„œ ?¤í–‰ ì¤‘ì…?ˆë‹¤.`);
}
bootstrap();



