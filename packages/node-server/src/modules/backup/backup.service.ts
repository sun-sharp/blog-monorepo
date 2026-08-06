import { Injectable } from '@nestjs/common';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { logger } from 'src/common/journal';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { storeDirStr } from 'src/common/constant/config';
import { createStoreDir } from 'src/common/fs-mkdir';
import { useCustomConfig } from 'src/config';
import { nowDateFun } from 'src/common/date';
import { IResponse } from '/#/common/common';

const execFileAsync = promisify(execFile);

const customConfig = useCustomConfig();
const { mongodbAccount, mongodbPassword, serverIp, databasePort, mongodbQuery, capitalDatabaseName, blogDatabaseName } = customConfig;

const mongodbHost = `${serverIp}:${databasePort}`;
const mongodbAuth = mongodbAccount && mongodbPassword ? { username: mongodbAccount, password: mongodbPassword } : null;
const authSourceMatch = mongodbQuery?.match(/authSource=([^&]+)/);
const authSource = authSourceMatch ? authSourceMatch[1] : 'admin';

export interface BackupFileInfo {
  fileName: string;
  fileSize: number;
  backupTime: string;
  database: string;
}

@Injectable()
export class BackupService {
  private readonly backupDir: string;

  constructor() {
    this.backupDir = resolve(process.cwd(), storeDirStr, 'binary');
  }

  private buildCommonArgs(command: 'dump' | 'restore', dbName: string, outputPath: string): string[] {
    const args: string[] = [`--host=${mongodbHost}`, `--db=${dbName}`, `--out=${outputPath}`];
    if (mongodbAuth) {
      args.push(`--username=${mongodbAuth.username}`, `--password=${mongodbAuth.password}`, `--authenticationDatabase=${authSource}`);
    }
    return args;
  }

  private async ensureBackupDir(): Promise<string> {
    createStoreDir();
    const binaryDir = resolve(process.cwd(), storeDirStr, 'binary');
    if (!existsSync(binaryDir)) {
      mkdirSync(binaryDir, { recursive: true });
      logger.log('创建binary备份目录');
    }
    return binaryDir;
  }

  /**
   * @description: 执行mongodump二进制备份指定数据库
   * @param {string} dbName
   * @param {string} outputPath
   * @return {Promise<void>}
   */
  private async execDump(dbName: string, outputPath: string): Promise<void> {
    const args = this.buildCommonArgs('dump', dbName, outputPath);
    logger.log(`开始二进制备份数据库: ${dbName} -> ${outputPath}`);
    await execFileAsync('mongodump', args, { maxBuffer: 1024 * 1024 * 100 });
    logger.log(`二进制备份数据库成功: ${dbName}`);
  }

  /**
   * @description: 执行mongorestore恢复指定数据库
   * @param {string} dbName
   * @param {string} inputPath
   * @return {Promise<void>}
   */
  private async execRestore(dbName: string, inputPath: string): Promise<void> {
    const args = [`--host=${mongodbHost}`, `--db=${dbName}`, `--dir=${inputPath}`, `--drop`];
    if (mongodbAuth) {
      args.push(`--username=${mongodbAuth.username}`, `--password=${mongodbAuth.password}`, `--authenticationDatabase=${authSource}`);
    }
    logger.log(`开始恢复数据库: ${dbName} <- ${inputPath}`);
    await execFileAsync('mongorestore', args, { maxBuffer: 1024 * 1024 * 100 });
    logger.log(`恢复数据库成功: ${dbName}`);
  }

  /**
   * @description: 二进制备份所有数据库
   * @return {Promise<IResponse>}
   */
  public backupAll(): Promise<IResponse> {
    return Promise.resolve()
      .then(async () => {
        const binaryDir = await this.ensureBackupDir();
        const timestamp = nowDateFun().replace(/[: ]/g, '-');
        const backupPath = join(binaryDir, `backup-${timestamp}`);
        if (!existsSync(backupPath)) {
          mkdirSync(backupPath, { recursive: true });
        }
        await this.execDump(capitalDatabaseName, backupPath);
        await this.execDump(blogDatabaseName, backupPath);
        return {
          code: ApiCode.SUCCESS,
          result: { backupPath, timestamp },
          message: '二进制备份成功！',
        };
      })
      .catch((err) => {
        logger.error(`二进制备份失败! ${err}`);
        return {
          code: ApiCode.ERROR,
          message: err?.message || err || '二进制备份失败！',
        };
      });
  }

  /**
   * @description: 二进制备份单个数据库
   * @param {string} dbName
   * @return {Promise<IResponse>}
   */
  public backupDatabase(dbName: string): Promise<IResponse> {
    return Promise.resolve(dbName)
      .then(async (dbName) => {
        if (dbName !== capitalDatabaseName && dbName !== blogDatabaseName) {
          throw `数据库名称无效，仅支持: ${capitalDatabaseName}, ${blogDatabaseName}`;
        }
        const binaryDir = await this.ensureBackupDir();
        const timestamp = nowDateFun().replace(/[: ]/g, '-');
        const backupPath = join(binaryDir, `backup-${dbName}-${timestamp}`);
        if (!existsSync(backupPath)) {
          mkdirSync(backupPath, { recursive: true });
        }
        await this.execDump(dbName, backupPath);
        return {
          code: ApiCode.SUCCESS,
          result: { backupPath, timestamp },
          message: `数据库 ${dbName} 二进制备份成功！`,
        };
      })
      .catch((err) => {
        logger.error(`二进制备份数据库 ${dbName} 失败! ${err}`);
        return {
          code: ApiCode.ERROR,
          message: err?.message || err || `数据库 ${dbName} 二进制备份失败！`,
        };
      });
  }

  /**
   * @description: 获取所有备份列表
   * @return {Promise<IResponse>}
   */
  public listBackups(): Promise<IResponse> {
    return Promise.resolve()
      .then(async () => {
        const binaryDir = await this.ensureBackupDir();
        const entries = readdirSync(binaryDir);
        const backups: BackupFileInfo[] = [];
        for (const entry of entries) {
          const entryPath = join(binaryDir, entry);
          const stat = statSync(entryPath);
          if (!stat.isDirectory()) continue;
          const subEntries = readdirSync(entryPath);
          for (const subEntry of subEntries) {
            const subPath = join(entryPath, subEntry);
            const subStat = statSync(subPath);
            if (!subStat.isDirectory()) continue;
            const files = readdirSync(subPath);
            const totalSize = files.reduce((sum, file) => {
              const filePath = join(subPath, file);
              const fileStat = statSync(filePath);
              return sum + (fileStat.isFile() ? fileStat.size : 0);
            }, 0);
            backups.push({
              fileName: entry,
              fileSize: totalSize,
              backupTime: this.parseBackupTime(entry),
              database: subEntry,
            });
          }
        }
        backups.sort((a, b) => b.backupTime.localeCompare(a.backupTime));
        return {
          code: ApiCode.SUCCESS,
          result: backups,
          message: '获取备份列表成功！',
        };
      })
      .catch((err) => {
        logger.error(`获取备份列表失败! ${err}`);
        return {
          code: ApiCode.ERROR,
          message: err?.message || err || '获取备份列表失败！',
        };
      });
  }

  /**
   * @description: 恢复数据库
   * @param {string} backupName 备份目录名 (如 backup-2026-01-01-00-00-00)
   * @param {string} dbName 要恢复的数据库名
   * @return {Promise<IResponse>}
   */
  public restoreDatabase(backupName: string, dbName: string): Promise<IResponse> {
    return Promise.resolve({ backupName, dbName })
      .then(async ({ backupName, dbName }) => {
        if (dbName !== capitalDatabaseName && dbName !== blogDatabaseName) {
          throw `数据库名称无效，仅支持: ${capitalDatabaseName}, ${blogDatabaseName}`;
        }
        const binaryDir = await this.ensureBackupDir();
        const backupPath = join(binaryDir, backupName, dbName);
        if (!existsSync(backupPath)) {
          throw `备份文件不存在: ${backupName}/${dbName}`;
        }
        await this.execRestore(dbName, backupPath);
        return {
          code: ApiCode.SUCCESS,
          message: `数据库 ${dbName} 恢复成功！`,
        };
      })
      .catch((err) => {
        logger.error(`恢复数据库 ${dbName} 失败! ${err}`);
        return {
          code: ApiCode.ERROR,
          message: err?.message || err || `数据库 ${dbName} 恢复失败！`,
        };
      });
  }

  /**
   * @description: 恢复所有数据库
   * @param {string} backupName 备份目录名
   * @return {Promise<IResponse>}
   */
  public restoreAll(backupName: string): Promise<IResponse> {
    return Promise.resolve(backupName)
      .then(async (backupName) => {
        const binaryDir = await this.ensureBackupDir();
        const backupPath = join(binaryDir, backupName);
        if (!existsSync(backupPath)) {
          throw `备份目录不存在: ${backupName}`;
        }
        const subEntries = readdirSync(backupPath).filter((entry) => {
          return existsSync(join(backupPath, entry));
        });
        const restoredDatabases: string[] = [];
        for (const subEntry of subEntries) {
          if (subEntry === capitalDatabaseName || subEntry === blogDatabaseName) {
            await this.execRestore(subEntry, join(backupPath, subEntry));
            restoredDatabases.push(subEntry);
          }
        }
        return {
          code: ApiCode.SUCCESS,
          result: { restoredDatabases },
          message: `数据库恢复成功！已恢复: ${restoredDatabases.join(', ')}`,
        };
      })
      .catch((err) => {
        logger.error(`恢复所有数据库失败! ${err}`);
        return {
          code: ApiCode.ERROR,
          message: err?.message || err || '恢复所有数据库失败！',
        };
      });
  }

  /**
   * @description: 删除指定备份
   * @param {string} backupName
   * @return {Promise<IResponse>}
   */
  public deleteBackup(backupName: string): Promise<IResponse> {
    return Promise.resolve(backupName)
      .then(async (backupName) => {
        const binaryDir = await this.ensureBackupDir();
        const backupPath = join(binaryDir, backupName);
        if (!existsSync(backupPath)) {
          throw `备份目录不存在: ${backupName}`;
        }
        const { rmSync } = await import('node:fs');
        rmSync(backupPath, { recursive: true, force: true });
        logger.log(`删除备份: ${backupName}`);
        return {
          code: ApiCode.SUCCESS,
          message: `删除备份成功！`,
        };
      })
      .catch((err) => {
        logger.error(`删除备份失败! ${err}`);
        return {
          code: ApiCode.ERROR,
          message: err?.message || err || '删除备份失败！',
        };
      });
  }

  /**
   * @description: 从备份目录名解析备份时间
   * @param {string} fileName
   * @return {string}
   */
  private parseBackupTime(fileName: string): string {
    const match = fileName.match(/(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})/);
    if (match) {
      const parts = match[1].split('-');
      return `${parts[0]}-${parts[1]}-${parts[2]} ${parts[3]}:${parts[4]}:${parts[5]}`;
    }
    return fileName;
  }
}
