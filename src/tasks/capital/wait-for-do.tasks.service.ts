import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WaitForDoService } from 'src/modules/capital/wait-for-do/wait-for-do.service';

@Injectable()
export class WaitForDoTasksService {
  constructor(private readonly waitForDoService: WaitForDoService) {}

  /**
   * @description 定时 删除待办前一周已完成数据
   * @memberof WaitForDoTasksService
   * 每天23点59分59秒启动
   */
  @Cron('59 59 23 * * *')
  cronDeleteWaitForDo() {
    // 前一周的时间差
    const aWeekAgoDiff = 7 * 24 * 60 * 60 * 1000;
    this.waitForDoService.removePeriodCompleted(aWeekAgoDiff);
  }
}
