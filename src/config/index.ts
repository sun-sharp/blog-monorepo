import { GlobalEnvConfig } from 'types/config';
import devConfig from './dev';
import prodConfig from './prod';
import * as dotenv from 'dotenv';

dotenv.config();

const configs = {
  dev: devConfig,
  prod: prodConfig,
};

const { RUNNING_ENV } = process.env;

console.log(RUNNING_ENV, 'RUNNING_ENV');

let env = 'prod';
if (RUNNING_ENV === 'dev') {
  env = 'dev';
}

export const useCustomConfig = (): GlobalEnvConfig => configs[env];
