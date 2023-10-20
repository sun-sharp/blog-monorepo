import { Module } from '@nestjs/common';
import { WaitForDoTasksService } from './wait-for-do.tasks.service';
import { ScheduleModule } from '@nestjs/schedule';
import { WaitForDoModule } from 'src/modules/capital/wait-for-do/wait-for-do.module';

@Module({
  imports: [ScheduleModule.forRoot(), WaitForDoModule],
  providers: [WaitForDoTasksService],
})
export class CapitalTasksModule {}
