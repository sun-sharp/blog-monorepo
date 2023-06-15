import type { GlobConfig } from '/#/config';

export const getAppEnvConfig = (): Readonly<GlobConfig> => {
  const ENV = import.meta.env as unknown as ViteEnv;

  const {
    VITE_PUBLIC_PATH,
    VITE_APP_TITLE,
    VITE_CAPITAL_API_URL,
    VITE_BLOG_API_URL,
    VITE_APP_SHORT_NAME,
    VITE_API_URL_PREFIX,
    VITE_IMG_URL,
    VITE_AUTHORIZATION_HEAD,
  } = ENV;

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    baseUrl: VITE_PUBLIC_PATH,
    title: VITE_APP_TITLE,
    capitalApiUrl: VITE_CAPITAL_API_URL,
    blogApiUrl: VITE_BLOG_API_URL,
    shortName: VITE_APP_SHORT_NAME,
    urlPrefix: VITE_API_URL_PREFIX,
    imgUrl: VITE_IMG_URL,
    tokenHead: VITE_AUTHORIZATION_HEAD,
  };
  return glob as Readonly<GlobConfig>;
};
