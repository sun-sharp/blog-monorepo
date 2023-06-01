import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CapitalModule } from './modules/capital/capital.module';
import { FileModule } from './modules/file/file.module';
import { MoneyModule } from './modules/money/money.module';
import { BlogModule } from './modules/blog/blog.module';
import { getEnvConfig } from './common/env-config';

@Module({
  imports: [
    CapitalModule,
    FileModule,
    ConfigModule.forRoot({
      isGlobal: true, // 作用于全局
      load: [() => getEnvConfig()], // 加载自定义配置项
      envFilePath: ['.env', '.env.dev', '.env.prod'], // 配置文件路径，也可以配置为数组如['/config/.env1','.env']。
      ignoreEnvFile: false, // 忽略配置文件，为true则仅读取操作系统环境变量，常用于生产环境
    }),
    MoneyModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
