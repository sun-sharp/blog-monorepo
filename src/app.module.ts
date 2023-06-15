import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CapitalModule } from './modules/capital/capital.module';
import { MoneyModule } from './modules/money/money.module';
import { BlogModule } from './modules/blog/blog.module';
import { useCustomConfig } from 'src/config';

@Module({
  imports: [
    CapitalModule,
    ConfigModule.forRoot({
      isGlobal: true, // 作用于全局
      load: [useCustomConfig], // 加载自定义配置项
    }),
    MoneyModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
