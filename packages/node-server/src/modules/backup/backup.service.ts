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
const { mongodbAccount, mongodbPassword, serverIp, databasePort, mongodbQuery, capitalDatabaseName, blogDatabaseName, mongodbBinPath } = customConfig;

const mongodbHost = `${serverIp}:${databasePort}`;
const mongodbAuth = mongodbAccount && mongodbPassword ? { username: mongodbAccount, password: mongodbPassword } : null;
const authSourceMatch = mongodbQuery?.match(/authSource=([^&]+)/);
const authSource = authSourceMatch ? authSourceMatch[1] : 'admin';

const isWin = process.platform === 'win32';
const dumpExe = isWin ? 'mongodump.exe' : 'mongodump';
const restoreExe = isWin ? 'mongorestore.exe' : 'mongorestore';

function resolveBin(exe: string): string {
  if (mongodbBinPath) {
    return resolve(mongodbBinPath, exe);
  }
  return exe;
}

export interface BackupCollectionInfo {
  name: string;
  fileSize: number;
}

export interface BackupDatabaseInfo {
  database: string;
  fileSize: number;
  collections: BackupCollectionInfo[];
}

export interface BackupFileInfo {
  fileName: string;
  fileSize: number;
  backupTime: string;
  database: string;
  collections: string[];
}

const validDatabases = [capitalDatabaseName, blogDatabaseName];

@Injectable()
export class BackupService {
  private readonly backupDir: string;

  constructor() {
    this.backupDir = resolve(process.cwd(), storeDirStr, 'binary');
  }

  private buildDumpArgs(dbName: string, outputPath: string, collection?: string): string[] {
    const args: string[] = [`--host=${mongodbHost}`, `--db=${dbName}`, `--out=${outputPath}`];
    if (collection) {
      args.push(`--collection=${collection}`);
    }
    if (mongodbAuth) {
      args.push(`--username=${mongodbAuth.username}`, `--password=${mongodbAuth.password}`, `--authenticationDatabase=${authSource}`);
    }
    return args;
  }

  private buildRestoreArgs(dbName: string, inputPath: string, collection?: string): string[] {
    const args: string[] = [`--host=${mongodbHost}`, `--db=${dbName}`, `--dir=${inputPath}`, `--drop`];
    if (collection) {
      args.push(`--collection=${collection}`);
    }
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

  private async execDump(dbName: string, outputPath: string, collection?: string): Promise<void> {
    const args = this.buildDumpArgs(dbName, outputPath, collection);
    const bin = resolveBin(dumpExe);
    const label = collection ? `${dbName}/${collection}` : dbName;
    logger.log(`开始二进制备份: ${label} -> ${outputPath}`);
    await execFileAsync(bin, args, { maxBuffer: 1024 * 1024 * 100, shell: true, windowsHide: true });
    logger.log(`二进制备份成功: ${label}`);
  }

  private async execRestore(dbName: string, inputPath: string, collection?: string): Promise<void> {
    const args = this.buildRestoreArgs(dbName, inputPath, collection);
    const bin = resolveBin(restoreExe);
    const label = collection ? `${dbName}/${collection}` : dbName;
    logger.log(`开始恢复: ${label} <- ${inputPath}`);
    await execFileAsync(bin, args, { maxBuffer: 1024 * 1024 * 100, shell: true, windowsHide: true });
    logger.log(`恢复成功: ${label}`);
  }

  private validateDbName(dbName: string): void {
    if (!validDatabases.includes(dbName)) {
      throw `数据库名称无效，仅支持: ${validDatabases.join(', ')}`;
    }
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
        this.validateDbName(dbName);
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
   * @description: 二进制备份单个集合
   * @param {string} dbName
   * @param {string} collection
   * @return {Promise<IResponse>}
   */
  public backupCollection(dbName: string, collection: string): Promise<IResponse> {
    return Promise.resolve({ dbName, collection })
      .then(async ({ dbName, collection }) => {
        this.validateDbName(dbName);
        const binaryDir = await this.ensureBackupDir();
        const timestamp = nowDateFun().replace(/[: ]/g, '-');
        const backupPath = join(binaryDir, `backup-${dbName}-${collection}-${timestamp}`);
        if (!existsSync(backupPath)) {
          mkdirSync(backupPath, { recursive: true });
        }
        await this.execDump(dbName, backupPath, collection);
        return {
          code: ApiCode.SUCCESS,
          result: { backupPath, timestamp },
          message: `集合 ${dbName}/${collection} 二进制备份成功！`,
        };
      })
      .catch((err) => {
        logger.error(`二进制备份集合 ${dbName}/${collection} 失败! ${err}`);
        return {
          code: ApiCode.ERROR,
          message: err?.message || err || `集合 ${dbName}/${collection} 二进制备份失败！`,
        };
      });
  }

  /**
   * @description: 获取所有备份列表（含集合信息）
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
          const dbEntries = readdirSync(entryPath);
          for (const dbEntry of dbEntries) {
            const dbPath = join(entryPath, dbEntry);
            const dbStat = statSync(dbPath);
            if (!dbStat.isDirectory()) continue;
            const files = readdirSync(dbPath);
            let totalSize = 0;
            const collections: string[] = [];
            for (const file of files) {
              const filePath = join(dbPath, file);
              const fileStat = statSync(filePath);
              if (fileStat.isFile()) {
                totalSize += fileStat.size;
                if (file.endsWith('.bson')) {
                  collections.push(file.replace(/\.bson$/, ''));
                }
              }
            }
            backups.push({
              fileName: entry,
              fileSize: totalSize,
              backupTime: this.parseBackupTime(entry),
              database: dbEntry,
              collections,
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
   * @param {string} backupName
   * @param {string} dbName
   * @return {Promise<IResponse>}
   */
  public restoreDatabase(backupName: string, dbName: string): Promise<IResponse> {
    return Promise.resolve({ backupName, dbName })
      .then(async ({ backupName, dbName }) => {
        this.validateDbName(dbName);
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
   * @description: 恢复单个集合
   * @param {string} backupName
   * @param {string} dbName
   * @param {string} collection
   * @return {Promise<IResponse>}
   */
  public restoreCollection(backupName: string, dbName: string, collection: string): Promise<IResponse> {
    return Promise.resolve({ backupName, dbName, collection })
      .then(async ({ backupName, dbName, collection }) => {
        this.validateDbName(dbName);
        const binaryDir = await this.ensureBackupDir();
        const backupPath = join(binaryDir, backupName, dbName);
        if (!existsSync(backupPath)) {
          throw `备份文件不存在: ${backupName}/${dbName}`;
        }
        await this.execRestore(dbName, backupPath, collection);
        return {
          code: ApiCode.SUCCESS,
          message: `集合 ${dbName}/${collection} 恢复成功！`,
        };
      })
      .catch((err) => {
        logger.error(`恢复集合 ${dbName}/${collection} 失败! ${err}`);
        return {
          code: ApiCode.ERROR,
          message: err?.message || err || `集合 ${dbName}/${collection} 恢复失败！`,
        };
      });
  }

  /**
   * @description: 恢复所有数据库
   * @param {string} backupName
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
        const subEntries = readdirSync(backupPath).filter((entry) => existsSync(join(backupPath, entry)));
        const restoredDatabases: string[] = [];
        for (const subEntry of subEntries) {
          if (validDatabases.includes(subEntry)) {
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

  private parseBackupTime(fileName: string): string {
    const match = fileName.match(/(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})/);
    if (match) {
      const parts = match[1].split('-');
      return `${parts[0]}-${parts[1]}-${parts[2]} ${parts[3]}:${parts[4]}:${parts[5]}`;
    }
    return fileName;
  }
}
