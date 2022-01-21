import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';

import * as pkg from '../package.json';

const { version } = pkg;

const logger = new Logger();
const title = 'NestJs博客API';
const desc = '我的测试博客API';
const globalPrefix = '/';
const swaggerUrl = 'swagger-api';

const port = 3000;

(async () => {
  // create app
  Promise.resolve(await NestFactory.create(AppModule))
    // 配置swagger
    .then((app) => {
      const config = new DocumentBuilder()
        .setTitle(title)
        .setDescription(desc)
        .setVersion(version)
        .addServer(globalPrefix)
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'jwt')
        .build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup(swaggerUrl, app, document);
      return app;
    })
    // 设置全局前缀
    .then((app) => {
      app.setGlobalPrefix(globalPrefix);
      return app;
    })
    // 设置异常
    .then((app) => {
      app.useGlobalFilters(new HttpExceptionFilter());
      return app;
    })
    // 验证管道
    .then((app) => {
      app.useGlobalPipes(new ValidationPipe({ transform: true }));
      return app;
    })
    // listen port
    .then((app) => app.listen(port))
    .finally(() => {
      logger.log(`http://127.0.0.1:${port}/${swaggerUrl}`);
      logger.log(`http://127.0.0.1:${port}${globalPrefix}`);
    });
})();
