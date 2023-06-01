import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';

import * as pkg from '../package.json';
import { join } from 'path';
import * as express from 'express';
import { logger } from './common/journal';
import { writeFileSync } from 'fs';
import { useCustomConfig } from './config';

const customConfig = useCustomConfig();

const { version } = pkg;

const title = 'NestJs博客API';
const globalPrefix = '/';
const swaggerUrl = 'swagger-api';
const swaggerJsonUrl = `public/json/${swaggerUrl}.json`;
const port = customConfig.port;
const desc = `我的测试博客API \n\n swagger的JSON文件：/${swaggerJsonUrl}`;

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
      writeFileSync(`./${swaggerJsonUrl}`, JSON.stringify(document));
      SwaggerModule.setup(swaggerUrl, app, document);
      return app;
    })
    // 配置 public 文件夹为静态目录，以达到可直接访问下面文件的目的
    .then((app) => {
      const rootDir = join(__dirname, '..');
      app.use('/public', express.static(join(rootDir, 'public')));
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
