import { GlobalEnvConfig } from 'types/config';

const glob: Readonly<GlobalEnvConfig> = {
  port: 3000,
  serverIp: '120.79.162.189',
  databasePort: 5606,
  mongodbAccount: 'yrr',
  mongodbPassword: 'AlyYrrAdmin123',
  mongodbQuery: '?authSource=admin',
  fileAccessPath: 'api_file',
  staticDirPosition: '../',
  staticDirName: 'api_static_dir',
  imageRefixName: 'sharp_network_',
};

export default glob as Readonly<GlobalEnvConfig>;
