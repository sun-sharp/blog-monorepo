import type { ComponentRenderProxy, VNode, VNodeChild, ComponentPublicInstance, FunctionalComponent, PropType as VuePropType } from 'vue';

declare global {
  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
  };
  // declare interface Window {
  //   // Global vue app instance
  //   __APP__: App<Element>;
  // }

  // vue
  declare type PropType<T> = VuePropType<T>;
  declare type VueNode = VNodeChild | JSX.Element;

  export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  };

  declare type Nullable<T> = T | null;
  declare type NonNullable<T> = T extends null | undefined ? never : T;
  declare type Recordable<T = any> = Record<string, T>;
  declare type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T;
  };
  declare type Indexable<T = any> = {
    [key: string]: T;
  };
  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };
  declare type TimeoutHandle = ReturnType<typeof setTimeout>;
  declare type IntervalHandle = ReturnType<typeof setInterval>;

  declare interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }

  declare interface WheelEvent {
    path?: EventTarget[];
  }

  interface ImportMetaEnv extends ViteEnv {
    __: unknown;
  }

  declare interface ViteEnv {
    // 网站根目录
    VITE_PUBLIC_PATH: string;
    // 标题
    VITE_APP_TITLE: string;
    // capital接口地址
    VITE_CAPITAL_API_URL: string;
    // blog接口地址
    VITE_BLOG_API_URL: string;
    // 文件上传地址
    VITE_FILE_API_URL: string;
    // money接口地址
    VITE_MONEY_API_URL: string;
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
    //生产环境打包
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none';
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
  }

  declare function parseInt(s: string | number, radix?: number): number;

  declare function parseFloat(string: string | number): number;

  namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode;
    // tslint:disable no-empty-interface
    type ElementClass = ComponentRenderProxy;

    interface ElementAttributesProperty {
      $props: any;
    }

    interface IntrinsicElements {
      [elem: string]: any;
    }

    interface IntrinsicAttributes {
      [elem: string]: any;
    }
  }
}

declare module 'vue' {
  export type JSXComponent<Props = any> = { new (): ComponentPublicInstance<Props> } | FunctionalComponent<Props>;
}
