import { GlobalEnvConfig } from 'types/config';

const glob: Readonly<GlobalEnvConfig> = {
  port: 3000,
  serverIp: '120.79.162.189',
  databasePort: 5606,
  mongodbAccount: 'yrr',
  mongodbPassword: 'AlyYrrAdmin123',
  mongodbQuery: '?authSource=admin',
  fileAccessPath: 'api_file',
  staticDirPosition: './',
  staticDirName: 'api_static_dir',
  imageRefixName: 'sharp_local_',
  capitalDatabaseName: 'dev_capital',
  blogDatabaseName: 'dev_blog',
};

export default glob as Readonly<GlobalEnvConfig>;
