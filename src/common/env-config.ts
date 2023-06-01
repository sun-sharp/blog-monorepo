import type { GlobalEnvConfig, ProcessEnv } from 'types/config';
import * as dotenv from 'dotenv';

/**
 * @description: 处理env的变量
 * @return {Readonly<GlobalEnvConfig>}
 */
export const getEnvConfig = (): Readonly<GlobalEnvConfig> => {
  // 环境变量配置
  dotenv.config();

  const ENV = process.env as unknown as ProcessEnv;

  const { SERVER_IP, PORT, DATABASE_PORT, MONGODB_ACCOUNT, MONGODB_PASSWORD, MONGODB_QUERY, FILE_FS_PATH, FILE_LIB } = ENV;

  console.log(SERVER_IP, PORT, DATABASE_PORT, MONGODB_ACCOUNT, MONGODB_PASSWORD, MONGODB_QUERY, FILE_FS_PATH, FILE_LIB);

  // Take global configuration
  const glob: Readonly<GlobalEnvConfig> = {
    serverIp: SERVER_IP,
    port: parseInt(PORT, 10),
    databasePort: parseInt(DATABASE_PORT, 10),
    mongodbAccount: MONGODB_ACCOUNT || '',
    mongodbPassword: MONGODB_PASSWORD || '',
    mongodbQuery: MONGODB_QUERY || '',
    fileFsPath: FILE_FS_PATH || '',
    fileLib: FILE_LIB || '',
  };
  return glob as Readonly<GlobalEnvConfig>;
};
