/// <reference types="@dcloudio/types" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 添加 uni-app 模块声明
declare module '@dcloudio/uni-app' {
  export const onLaunch: (callback: (options?: Record<string, any>) => void) => void;
  export const onLoad: (callback: (options?: Record<string, any>) => void) => void;
  export const onShow: (callback: (options?: Record<string, any>) => void) => void;
  // 根据需要添加其他钩子...
}
