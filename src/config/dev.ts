import { GlobalEnvConfig } from 'types/config';

const glob: Readonly<GlobalEnvConfig> = {
  port: 3000,
  serverIp: '127.0.0.1',
  databasePort: 27017,
  mongodbAccount: '',
  mongodbPassword: '',
  mongodbQuery: '',
  fileFsPath: '',
  fileLib: '.',
  imageRefixName: 'sharp_local_',
};

export default glob as Readonly<GlobalEnvConfig>;
