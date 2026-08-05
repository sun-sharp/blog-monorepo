import { GlobalEnvConfig } from '/#/api/config';
import devConfig from './dev';
import prodConfig from './prod';
import * as dotenv from 'dotenv';
import { resolve } from 'node:path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

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
