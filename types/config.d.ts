// database 配置
export interface DatabaseConfig {
  // 服务器ip地址
  serverIp: string;
  // 数据库端口
  databasePort: number;
  // mongodb的账号
  mongodbAccount: string;
  // mongodb的密码
  mongodbPassword: string;
  // mongodb的参数信息
  mongodbQuery: string;
}

// env 配置
export interface GlobalEnvConfig extends DatabaseConfig {
  // 运行端口
  port: number;
  // 文件读取目录
  fileAccessPath: string;
  // 静态根目录位置
  staticDirPosition: string;
  // 静态根目录名称
  staticDirName: string;
  // 图片前缀
  imageRefixName: string;
  // capital数据库名称
  capitalDatabaseName: string;
  // blog数据库名称
  blogDatabaseName: string;
  // // 存储根目录位置
  // storeDirPosition: string;
  // // 存储根目录名称
  // storeDirName: string;
}
