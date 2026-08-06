import { Controller, Get, Post, Delete, Param, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpStatus } from 'src/common/enums/api-code.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { BackupService } from './backup.service';

@Controller('backup')
@ApiTags('数据备份')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('all')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '二进制备份所有数据库' })
  backupAll() {
    return this.backupService.backupAll();
  }

  @Post('database/:dbName')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '二进制备份指定数据库' })
  backupDatabase(@Param('dbName') dbName: string) {
    return this.backupService.backupDatabase(dbName);
  }

  @Get('list')
  @ApiOperation({ summary: '获取所有备份列表' })
  listBackups() {
    return this.backupService.listBackups();
  }

  @Post('restore/all/:backupName')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '从备份恢复所有数据库' })
  restoreAll(@Param('backupName') backupName: string) {
    return this.backupService.restoreAll(backupName);
  }

  @Post('restore/:backupName/:dbName')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '从备份恢复指定数据库' })
  restoreDatabase(@Param('backupName') backupName: string, @Param('dbName') dbName: string) {
    return this.backupService.restoreDatabase(backupName, dbName);
  }

  @Delete(':backupName')
  @HttpCode(ApiHttpStatus.SUCCESS)
  @ApiOperation({ summary: '删除指定备份' })
  deleteBackup(@Param('backupName') backupName: string) {
    return this.backupService.deleteBackup(backupName);
  }
}
