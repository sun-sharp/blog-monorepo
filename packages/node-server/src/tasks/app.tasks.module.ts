import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppTasksService } from './app.tasks.service';
import { CapitalTasksModule } from './capital/capital.tasks.module';
import { CapitalModule } from 'src/modules/capital/capital.module';
import { BlogModule } from 'src/modules/blog/blog.module';
import { BackupModule } from 'src/modules/backup/backup.module';

@Module({
  imports: [ScheduleModule.forRoot(), CapitalTasksModule, CapitalModule, BlogModule, BackupModule],
  providers: [AppTasksService],
})
export class AppTasksModule {}
