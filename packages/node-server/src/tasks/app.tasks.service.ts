import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BackupService } from 'src/modules/backup/backup.service';

@Injectable()
export class AppTasksService {
  constructor(private readonly backupService: BackupService) {}

  /**
   * @description 定时二进制备份所有数据库
   * 每周日凌晨3点执行
   */
  @Cron('0 3 * * 0')
  cronBinaryBackupAll() {
    this.backupService.backupAll();
  }
}
