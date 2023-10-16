import { GlobalEnvConfig } from 'types/config';

const glob: Readonly<GlobalEnvConfig> = {
  port: 3300,
  serverIp: '120.79.162.189',
  databasePort: 5606,
  mongodbAccount: 'yrr',
  mongodbPassword: 'AlyYrrAdmin123',
  mongodbQuery: '?authSource=admin',
  fileAccessPath: 'api_dev_file',
  staticDirPosition: '../',
  staticDirName: 'api_dev_static_dir',
  imageRefixName: 'sharp_dev_network_',
  capitalDatabaseName: 'dev_capital',
  blogDatabaseName: 'dev_blog',
};

export default glob as Readonly<GlobalEnvConfig>;
