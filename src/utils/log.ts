import { getAppEnvConfig } from './env';

const appEnvConfig = getAppEnvConfig();
const projectName = appEnvConfig.shortName;

export function warn(message: string) {
  console.warn(`[${projectName} warn]:${message}`);
}

export function error(message: string) {
  throw new Error(`[${projectName} error]:${message}`);
}
