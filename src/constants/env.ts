import { isJsonString, isNumberString } from '@/utils';

// 处理env的数据
const getEnvConfig = (): ViteEnv => {
  const ENV = import.meta.env as Recordable;
  Object.keys(ENV).forEach((key) => {
    const it = ENV[key];
    // 判断是否是枚举值
    if (it === 'true' || it === 'false') {
      ENV[key] = it === 'true';
    }
    // 判断是否是数字
    else if (isNumberString(it)) {
      ENV[key] = Number(it);
    }
    // 判断字符串是否是json格式
    else if (isJsonString(it)) {
      ENV[key] = JSON.parse(it);
    }
  });
  return ENV as ViteEnv;
};

export const { VITE_PUBLIC_PATH, VITE_APP_TITLE, VITE_APP_SHORT_NAME, VITE_API_URL_PREFIX, VITE_IMG_URL, VITE_CAPITAL_API_URL, VITE_BLOG_API_URL } =
  getEnvConfig();
