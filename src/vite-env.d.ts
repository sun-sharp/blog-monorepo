/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_PORT: number;
  readonly VITE_PUBLIC_PATH: string;
  readonly VITE_DROP_CONSOLE: boolean;
  readonly VITE_PROXY: string;
  readonly VITE_CAPITAL_API_URL: string;
  readonly VITE_BLOG_API_URL: string;
  readonly VITE_API_URL_PREFIX: string;
  readonly VITE_IMG_URL: string;
  readonly VITE_USE_MOCK: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ViteEnv {
  VITE_APP_TITLE: string;
  VITE_PORT: number;
  VITE_PUBLIC_PATH: string;
  VITE_DROP_CONSOLE: boolean;
  VITE_PROXY: string;
  VITE_CAPITAL_API_URL: string;
  VITE_BLOG_API_URL: string;
  VITE_API_URL_PREFIX: string;
  VITE_IMG_URL: string;
  VITE_USE_MOCK: boolean;
}

interface Result<T = any> {
  code: number;
  data: T;
  msg: string;
}
