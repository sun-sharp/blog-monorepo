import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CapitalModule } from './modules/capital/capital.module';
import { BlogModule } from './modules/blog/blog.module';
import { useCustomConfig } from 'src/config';
import { CapitalTasksModule } from './tasks/capital/capital.tasks.module';

@Module({
  imports: [
    CapitalModule,
    ConfigModule.forRoot({
      isGlobal: true, // 作用于全局
      load: [useCustomConfig], // 加载自定义配置项
    }),
    BlogModule,
    // 定时任务
    CapitalTasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
