import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';

import * as pkg from '../package.json';
import { join } from 'path';
import * as express from 'express';
import { logger } from './common/journal';
import { useCustomConfig } from './config';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

import * as bodyParser from 'body-parser';

const customConfig = useCustomConfig();

const { fileAccessPath, staticDirPosition, staticDirName, port } = customConfig;
const { version } = pkg;
const title = 'NestJs博客API';
const globalPrefix = '/';
const swaggerUrl = 'swagger-api';
const desc = `我的测试博客API \n\n swagger的JSON文件：/${fileAccessPath}/json/${swaggerUrl}.json`;

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
      // 判断json目录是否路径存在
      const jsonDir = `${staticDirPosition}${staticDirName}/json`;
      const hasDir = existsSync(jsonDir);
      if (!hasDir) {
        // 创建json目录
        mkdirSync(jsonDir);
        logger.log('创建json目录');
      }
      // 写入swaggerUrl.json文件
      writeFileSync(`${jsonDir}/${swaggerUrl}.json`, JSON.stringify(document, null, '\t'));
      logger.log('写入swaggerUrl.json文件');
      // 只在开发时运行swagger路径
      const { RUNNING_ENV } = process.env;
      if (RUNNING_ENV === 'dev') {
        SwaggerModule.setup(swaggerUrl, app, document);
      }
      return app;
    })
    // 配置 public 文件夹为静态目录，以达到可直接访问下面文件的目的
    .then((app) => {
      const rootDir = join(__dirname, `../${staticDirPosition}`);
      app.use(`/${fileAccessPath}`, express.static(join(rootDir, staticDirName)));
      return app;
    })
    // 修改body传参的数据量为50mb
    .then((app) => {
      const limit = '50mb';
      app.use(bodyParser.json({ limit }));
      app.use(bodyParser.urlencoded({ limit, extended: true }));
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
      // 只在开发时运行swagger路径
      const { RUNNING_ENV } = process.env;
      if (RUNNING_ENV === 'dev') {
        logger.log(`http://127.0.0.1:${port}/${swaggerUrl}`);
      }
      logger.log(`http://127.0.0.1:${port}${globalPrefix}`);
    });
})();
