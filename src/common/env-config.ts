import type { GlobalEnvConfig, ProcessEnv } from 'types/config';

export const getEnvConfig = (): Readonly<GlobalEnvConfig> => {
  const ENV = process.env as unknown as ProcessEnv;

  const { SERVER_IP, PORT, DATABASE_PORT, MONGODB_ACCOUNT, MONGODB_PASSWORD, MONGODB_QUERY, FILE_FS_PATH, FILE_LIB } = ENV;

  // Take global configuration
  const glob: Readonly<GlobalEnvConfig> = {
    serverIp: SERVER_IP || '127.0.0.1',
    port: parseInt(PORT, 10) || 3000,
    databasePort: parseInt(DATABASE_PORT, 10) || 27017,
    mongodbAccount: MONGODB_ACCOUNT || '',
    mongodbPassword: MONGODB_PASSWORD || '',
    mongodbQuery: MONGODB_QUERY || '',
    fileFsPath: FILE_FS_PATH || '',
    fileLib: FILE_LIB || '',
  };
  return glob as Readonly<GlobalEnvConfig>;
};
