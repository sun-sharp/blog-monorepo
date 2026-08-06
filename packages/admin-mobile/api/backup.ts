import { backupRequest } from '../utils/request';

export interface BackupFileInfo {
  fileName: string;
  fileSize: number;
  backupTime: string;
  database: string;
}

export interface BackupResult {
  backupPath: string;
  timestamp: string;
}

export interface RestoreResult {
  restoredDatabases: string[];
}

const basic = '';

export const backupAll = (): Promise<BackupResult> => {
  return backupRequest({
    url: `${basic}/all`,
    method: 'POST',
    loadingText: '正在备份...',
    timeout: 120000,
  });
};

export const backupDatabase = (dbName: string): Promise<BackupResult> => {
  return backupRequest({
    url: `${basic}/database/${dbName}`,
    method: 'POST',
    loadingText: '正在备份...',
    timeout: 120000,
  });
};

export const listBackups = (): Promise<BackupFileInfo[]> => {
  return backupRequest({
    url: `${basic}/list`,
    method: 'GET',
  });
};

export const restoreAll = (backupName: string): Promise<RestoreResult> => {
  return backupRequest({
    url: `${basic}/restore/all/${backupName}`,
    method: 'POST',
    loadingText: '正在恢复...',
    timeout: 120000,
  });
};

export const restoreDatabase = (backupName: string, dbName: string): Promise<undefined> => {
  return backupRequest({
    url: `${basic}/restore/${backupName}/${dbName}`,
    method: 'POST',
    loadingText: '正在恢复...',
    timeout: 120000,
  });
};

export const removeBackup = (backupName: string): Promise<undefined> => {
  return backupRequest({
    url: `${basic}/${backupName}`,
    method: 'DELETE',
    isShowSuccessMessage: true,
  });
};
