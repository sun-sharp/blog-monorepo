import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BlogService } from 'src/modules/blog/blog.service';
import { CapitalService } from 'src/modules/capital/capital.service';
import { BackupService } from 'src/modules/backup/backup.service';

@Injectable()
export class AppTasksService {
  constructor(
    private readonly capitalService: CapitalService,
    private readonly blogService: BlogService,
    private readonly backupService: BackupService,
  ) {}
  /**
   * @description 定时备份Capital数据库(JSON)
   * 每天23点59分59秒启动
   */
  @Cron('59 59 23 * * *')
  // @Cron('59 20 15 * * *')
  cronBackupsCapital() {
    this.capitalService.backupsCapital();
  }

  /**
   * @description 定时备份blog数据库(JSON)
   * 每天23点59分59秒启动
   */
  @Cron('59 59 23 * * *')
  // @Cron('59 20 15 * * *')
  cronBackupsBlog() {
    this.blogService.backupsBlog();
  }

  /**
   * @description 定时二进制备份所有数据库
   * 每周日凌晨3点执行
   */
  @Cron('0 3 * * 0')
  cronBinaryBackupAll() {
    this.backupService.backupAll();
  }
}
