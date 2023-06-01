import devConfig from './dev';
import prodConfig from './prod';
import * as dotenv from 'dotenv';

dotenv.config();

const configs = {
  dev: devConfig,
  prod: prodConfig,
};

const { RUNNING_ENV } = process.env;
let env = 'prod';
if (RUNNING_ENV === 'dev') {
  env = 'dev';
}

export const useCustomConfig = () => configs[env];
