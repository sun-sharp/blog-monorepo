// env 配置
export interface GlobalEnvConfig {
  // 服务器ip地址
  serverIp: string;
  // 运行端口
  port: number;
  // 数据库端口
  databasePort: number;
  // mongodb的账号
  mongodbAccount: string;
  // mongodb的密码
  mongodbPassword: string;
  // mongodb的参数信息
  mongodbQuery: string;
  // 文件导出根目录
  fileFsPath: string;
  // 文件根目录
  fileLib: string;
}

// env 配置
export interface ProcessEnv {
  // 服务器ip地址
  SERVER_IP?: string;
  // 运行端口
  PORT?: string;
  // 数据库端口
  DATABASE_PORT?: string;
  // mongodb的账号
  MONGODB_ACCOUNT?: string;
  // mongodb的密码
  MONGODB_PASSWORD?: string;
  // mongodb的参数信息
  MONGODB_QUERY?: string;
  // 文件导出根目录
  FILE_FS_PATH?: string;
  // 文件根目录
  FILE_LIB?: string;
}
