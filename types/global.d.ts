export {};

declare global {
  type Recordable<T = any> = Record<string, T>;

  interface ViteEnv {
    // 网站根目录
    VITE_PUBLIC_PATH: string;
    // 标题
    VITE_APP_TITLE: string;
    // capital接口地址
    VITE_CAPITAL_API_URL: string;
    // blog接口地址
    VITE_BLOG_API_URL: string;
    // 接口前缀
    VITE_API_URL_PREFIX?: string;
    // Project abbreviation
    VITE_APP_SHORT_NAME: string;
    //图片前缀地址
    VITE_IMG_URL?: string;
    // token前缀
    VITE_AUTHORIZATION_HEAD?: string;
    /* vite运行部署配置 */
    // 端口
    VITE_PORT: number;
    // 是否使用mock
    VITE_USE_MOCK: boolean;
    // console是否使用
    VITE_DROP_CONSOLE: boolean;
    // 跨越代理
    VITE_PROXY: [string, string][];
  }

  interface browserWindow extends Window {
    webkitRequestAnimationFrame?: (callback: FrameRequestCallback) => number;
    mozRequestAnimationFrame?: (callback: FrameRequestCallback) => number;
    oRequestAnimationFrame?: (callback: FrameRequestCallback) => number;
    msRequestAnimationFrame?: (callback: FrameRequestCallback) => number;
  }

  interface SharpWindow extends Window {
    $message?: MessageInstance;
  }
}
