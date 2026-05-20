import { GlobConfig } from '/#/common/config';

export const getAppEnvConfig = (): Readonly<GlobConfig> => {
  const ENV = import.meta.env as any;

  const {
    VITE_BASE_URL,
    VITE_APP_TITLE,
    VITE_CAPITAL_API_URL,
    VITE_BLOG_API_URL,
    VITE_APP_SHORT_NAME,
    VITE_AUTHORIZATION_HEAD,
  } = ENV;

  const glob: Readonly<GlobConfig> = {
    baseUrl: VITE_BASE_URL || '/',
    title: VITE_APP_TITLE,
    capitalApiUrl: VITE_CAPITAL_API_URL,
    blogApiUrl: VITE_BLOG_API_URL,
    shortName: VITE_APP_SHORT_NAME,
    tokenHead: VITE_AUTHORIZATION_HEAD,
  };
  return glob as Readonly<GlobConfig>;
};

export const APP_ENV_CONFIG = getAppEnvConfig();
