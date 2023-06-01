import devConfig from './dev';
import prodConfig from './prod';
import * as dotenv from 'dotenv';

dotenv.config();

const configs = {
  dev: devConfig,
  prod: prodConfig,
};

console.log(process.env.RUNNING_ENV, 'process.env.RUNNING_ENV');
console.log(process.env.NODE_ENV, 'process.env.NODE_ENV');

const { RUNNING_ENV } = process.env;
let env = 'dev';
if (RUNNING_ENV === 'dev') {
  env = 'dev';
} else if (RUNNING_ENV === 'prod') {
  env = 'prod';
}

export const useCustomConfig = () => configs[env];
