// env 配置
export interface GlobalEnvConfig {
  port: number;
  fileFsPath: string;
  fileLib: string;
}

// env 配置
export interface ProcessEnv {
  PORT?: string;
  FILE_FS_PATH?: string;
  FILE_LIB?: string;
}
