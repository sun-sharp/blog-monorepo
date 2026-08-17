import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CapitalModule } from './modules/capital/capital.module';
import { BlogModule } from './modules/blog/blog.module';
import { BackupModule } from './modules/backup/backup.module';
import { Pm2LogModule } from './modules/pm2-log/pm2-log.module';
import { useCustomConfig } from 'src/config';
import { validateEnv } from 'src/config/env.validation';
import { AppTasksModule } from './tasks/app.tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
      load: [useCustomConfig],
    }),
    CapitalModule,
    BlogModule,
    BackupModule,
    Pm2LogModule,
    RouterModule.register([
      {
        path: '',
        children: [{ path: '/', module: BackupModule }],
      },
    ]),
    // 定时任务
    AppTasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
