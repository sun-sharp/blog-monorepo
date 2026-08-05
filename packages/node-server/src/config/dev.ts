import { readFileSync } from 'node:fs';
import { storeDirStr } from 'src/common/constant/config';
import { createStoreDir } from 'src/common/fs-mkdir';
import { DatabaseConfig, GlobalEnvConfig } from '/#/api/config';

// 获取数据库配置文件信息
createStoreDir();
const buffer = readFileSync(`${storeDirStr}/json/database/dev.json`, 'utf-8');

// 数据库配置
const database: DatabaseConfig = JSON.parse(buffer);

const glob: Readonly<GlobalEnvConfig> = {
  ...database,
  port: 3002,
  fileAccessPath: 'api_dev_file',
  staticDirPosition: '../',
  staticDirName: 'api_dev_static_dir',
  imageRefixName: 'sharp_local_',
  capitalDatabaseName: 'dev_capital',
  blogDatabaseName: 'dev_blog',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
};

export default glob as Readonly<GlobalEnvConfig>;
