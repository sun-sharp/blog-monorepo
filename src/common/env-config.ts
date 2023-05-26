import type { GlobalEnvConfig, ProcessEnv } from 'types/config';

export const getEnvConfig = (): Readonly<GlobalEnvConfig> => {
  const ENV = process.env as unknown as ProcessEnv;

  const { PORT, FILE_FS_PATH, FILE_LIB } = ENV;

  // Take global configuration
  const glob: Readonly<GlobalEnvConfig> = {
    port: parseInt(PORT, 10) || 3000,
    fileFsPath: FILE_FS_PATH || '',
    fileLib: FILE_LIB || '',
  };
  return glob as Readonly<GlobalEnvConfig>;
};
