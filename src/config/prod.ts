import { GlobalEnvConfig } from 'types/config';

const glob: Readonly<GlobalEnvConfig> = {
  port: 3000,
  serverIp: '120.79.162.189',
  databasePort: 5606,
  mongodbAccount: 'yrr',
  mongodbPassword: 'AlyYrrAdmin123',
  mongodbQuery: '?authSource=admin',
  fileFsPath: '',
  fileLib: '',
  imageRefixName: 'sharp_network_',
};

export default glob as Readonly<GlobalEnvConfig>;
