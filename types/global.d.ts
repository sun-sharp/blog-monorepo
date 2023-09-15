/// <reference types="vite/client" />

import type { VNodeChild, PropType as VuePropType } from 'vue';
import { LoadingBarApiInjection } from 'naive-ui/es/loading-bar/src/LoadingBarProvider';
import { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider';
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';

declare global {
  // app 项目信息
  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
  };

  // vue
  type PropType<T> = VuePropType<T>;
  type VueNode = VNodeChild | JSX.Element;

  // 可能为null
  type Nullable<T> = T | null;
  // type NonNullable<T> = T extends null | undefined ? never : T;
  type Recordable<T = any> = Record<string, T>;

  // 定时器初始化
  type TimeoutHandle = ReturnType<typeof setTimeout>;
  type IntervalHandle = ReturnType<typeof setInterval>;

  // 点击事件
  interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }

  // env参数配置
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

  namespace JSX {
    interface ElementAttributesProperty {
      $props: {};
    }

    interface IntrinsicElements {
      [elem: string]: any;
    }

    interface IntrinsicAttributes {
      [elem: string]: any;
    }
  }

  // window 参数
  interface WindowConfig extends Window {
    $loading?: LoadingBarApiInjection;
    $message?: MessageApiInjection;
    $dialog?: DialogApiInjection;
  }

  type Component<T = any> = ReturnType<typeof defineComponent> | (() => Promise<typeof import('*.vue')>) | (() => Promise<T>);
}
