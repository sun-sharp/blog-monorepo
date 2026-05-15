import { existsSync, mkdirSync } from 'node:fs';
import { storeDirStr } from './constant/config';

/**
 * @description: 创建存储文件夹目录
 */
export const createStoreDir = async () => {
  const hasDir = existsSync(storeDirStr);
  if (!hasDir) {
    // 创建目录
    mkdirSync(storeDirStr);
  }
};
