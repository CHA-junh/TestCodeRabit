<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil MyÅ›liwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# BIST_NEW Server - Swagger UI ?°ë™ ê°€?´ë“œ

## Swagger?€?
NestJS?ì„œ API ë¬¸ì„œë¥??ë™?¼ë¡œ ?ì„±?´ì£¼???„êµ¬?…ë‹ˆ?? Swagger UIë¥??µí•´ APIë¥??¹ì—???½ê²Œ ?ŒìŠ¤?¸í•˜ê³??•ì¸?????ˆìŠµ?ˆë‹¤.

---

## 1. Swagger ?¨í‚¤ì§€ ?¤ì¹˜

```bash
npm install @nestjs/swagger swagger-ui-express
npm install --save-dev @types/swagger-ui-express
```

## 2. Validation ?¨í‚¤ì§€ ?¤ì¹˜

```bash
npm install class-validator class-transformer
```

---

## 3. main.ts??Swagger ?¤ì • ì¶”ê? - ?ìš©??

```ts
// src/main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger ?¤ì •
  const config = new DocumentBuilder()
    .setTitle('BIST API')
    .setDescription('BIST ?œë²„ API ë¬¸ì„œ')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors();
  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`?? ?œë²„ê°€ http://localhost:${port} ?ì„œ ?¤í–‰ ì¤‘ì…?ˆë‹¤.`);
}
bootstrap();
```

---

## 4. ?œë²„ ?¤í–‰ ë°?Swagger UI ?‘ì†

```bash
npm run start:dev
```

- ë¸Œë¼?°ì??ì„œ [http://localhost:8080/api-docs](http://localhost:8080/api-docs) ?‘ì†
- API ëª…ì„¸ ë°??ŒìŠ¤??ê°€??

---

## 5. ì»¨íŠ¸ë¡¤ëŸ¬/DTO??Swagger ?°ì½”?ˆì´??ì¶”ê? (? íƒ)

???ë???ë¬¸ì„œ?”ë? ?„í•´ ?„ë˜?€ ê°™ì´ ?°ì½”?ˆì´?°ë? ì¶”ê??????ˆìŠµ?ˆë‹¤.

```ts
import { ApiTags, ApiProperty } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController { ... }

export class LoginDto {
  @ApiProperty({ description: '?¬ìš©???„ì´?? })
  username: string;
  @ApiProperty({ description: 'ë¹„ë?ë²ˆí˜¸' })
  password: string;
}
```

---

## ì°¸ê³ 
- NestJS ê³µì‹ ë¬¸ì„œ: https://docs.nestjs.com/openapi/introduction
- Swagger ê³µì‹ ë¬¸ì„œ: https://swagger.io/docs/


