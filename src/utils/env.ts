import { warn } from '@/utils/log';
import pkg from '../../package.json';
import { useGlobSetting } from './setting';

export function getCommonStoragePrefix() {
  const { shortName } = useGlobSetting();
  return `${shortName}__${getEnv()}`.toUpperCase();
}

// 根据版本生成缓存密钥
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

export function getAppEnvConfig() {
  const ENV = import.meta.env as unknown as ViteEnv;

  const {
    VITE_PUBLIC_PATH,
    VITE_APP_TITLE,
    VITE_CAPITAL_API_URL,
    VITE_BLOG_API_URL,
    VITE_MOCK_API_URL,
    VITE_APP_SHORT_NAME,
    VITE_API_URL_PREFIX,
    VITE_UPLOAD_URL,
    VITE_USE_MOCK,
    VITE_IMG_URL,
  } = ENV;

  if (!/^[a-zA-Z\_]*$/.test(VITE_APP_SHORT_NAME)) {
    warn(`VITE_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`);
  }

  return {
    VITE_PUBLIC_PATH,
    VITE_APP_TITLE,
    VITE_CAPITAL_API_URL,
    VITE_BLOG_API_URL,
    VITE_MOCK_API_URL,
    VITE_APP_SHORT_NAME,
    VITE_API_URL_PREFIX,
    VITE_UPLOAD_URL,
    VITE_USE_MOCK,
    VITE_IMG_URL,
  };
}

/**
 * @description: 开发模式
 */
export const devMode = 'development';

/**
 * @description: 生产模式
 */
export const prodMode = 'production';

/**
 * @description: 获取环境变量
 * @returns:
 * @example:
 */
export function getEnv(): string {
  return import.meta.env.MODE;
}

/**
 * @description: 是否是开发模式
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV;
}

/**
 * @description: 是否是生产模式
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD;
}
