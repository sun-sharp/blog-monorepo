import { GlobalEnvConfig } from 'types/config';

const glob: Readonly<GlobalEnvConfig> = {
  port: 3000,
  serverIp: '127.0.0.1',
  databasePort: 27017,
  mongodbAccount: '',
  mongodbPassword: '',
  mongodbQuery: '',
  fileAccessPath: 'api_file',
  staticDirPosition: './',
  staticDirName: 'api_static_dir',
  imageRefixName: 'sharp_local_',
};

export default glob as Readonly<GlobalEnvConfig>;
