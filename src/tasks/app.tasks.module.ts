import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppTasksService } from './app.tasks.service';
import { CapitalTasksModule } from './capital/capital.tasks.module';
import { CapitalModule } from 'src/modules/capital/capital.module';
import { BlogModule } from 'src/modules/blog/blog.module';

@Module({
  imports: [ScheduleModule.forRoot(), CapitalTasksModule, CapitalModule, BlogModule],
  providers: [AppTasksService],
})
export class AppTasksModule {}
