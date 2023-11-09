import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BlogService } from 'src/modules/blog/blog.service';
import { CapitalService } from 'src/modules/capital/capital.service';

@Injectable()
export class AppTasksService {
  constructor(
    private readonly capitalService: CapitalService,
    private readonly blogService: BlogService,
  ) {}
  /**
   * @description 定时备份Capital数据库
   * 每天23点59分59秒启动
   */
  // @Cron('59 59 23 * * *')
  @Cron('59 20 14 * * *')
  cronBackupsCapital() {
    this.capitalService.backupsCapital();
  }

  /**
   * @description 定时备份blog数据库
   * 每天23点59分59秒启动
   */
  // @Cron('59 59 23 * * *')
  @Cron('59 20 15 * * *')
  cronBackupsBlog() {
    this.blogService.backupsCapital();
  }
}
