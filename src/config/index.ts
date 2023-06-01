import devConfig from './dev';
import prodConfig from './prod';

const configs = {
  dev: devConfig,
  prod: prodConfig,
};

const { RUNNING_ENV } = process.env;
let env = 'dev';
if (RUNNING_ENV === 'dev') {
  env = 'dev';
} else if (RUNNING_ENV === 'prod') {
  env = 'prod';
}

export const useCustomConfig = () => configs[env];
