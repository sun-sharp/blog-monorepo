import type { GlobConfig } from '/#/config';
import { getAppEnvConfig } from '@/utils/env';

export const useGlobSetting = (): Readonly<GlobConfig> => {
  const {
    VITE_APP_TITLE,
    VITE_CAPITAL_API_URL,
    VITE_BLOG_API_URL,
    VITE_MOCK_API_URL,
    VITE_APP_SHORT_NAME,
    VITE_API_URL_PREFIX,
    VITE_UPLOAD_URL,
    VITE_PROD_MOCK,
    VITE_IMG_URL,
    VITE_PUBLIC_PATH,
  } = getAppEnvConfig();

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    baseUrl: VITE_PUBLIC_PATH,
    title: VITE_APP_TITLE,
    capitalApiUrl: VITE_CAPITAL_API_URL,
    blogApiUrl: VITE_BLOG_API_URL,
    mockApiUrl: VITE_MOCK_API_URL,
    shortName: VITE_APP_SHORT_NAME,
    urlPrefix: VITE_API_URL_PREFIX,
    uploadUrl: VITE_UPLOAD_URL,
    prodMock: VITE_PROD_MOCK,
    imgUrl: VITE_IMG_URL,
  };
  return glob as Readonly<GlobConfig>;
};
