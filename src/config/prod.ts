import { readFileSync } from 'node:fs';
import { storeDirStr } from 'src/common/constant/config';
import { createStoreDir } from 'src/common/fs-mkdir';
import { DatabaseConfig, GlobalEnvConfig } from 'types/config';

// 获取数据库配置文件信息
createStoreDir();
const buffer = readFileSync(`${storeDirStr}/json/database/prod.json`, 'utf-8');

// 数据库配置
const database: DatabaseConfig = JSON.parse(buffer);

const glob: Readonly<GlobalEnvConfig> = {
  ...database,
  port: 3000,
  fileAccessPath: 'api_file',
  staticDirPosition: '../',
  staticDirName: 'api_static_dir',
  imageRefixName: 'sharp_network_',
  imagePrefixUrl: '',
  capitalDatabaseName: 'capital',
  blogDatabaseName: 'blog',
};

export default glob as Readonly<GlobalEnvConfig>;
