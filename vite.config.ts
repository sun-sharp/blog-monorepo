import type { UserConfig, ConfigEnv, ProxyOptions } from 'vite';
import { loadEnv } from 'vite';
import { resolve } from 'path';
import pkg from './package.json';
import { format } from 'date-fns';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import html from 'vite-plugin-html';
import { viteMockServe } from 'vite-plugin-mock';

type ProxyItem = [string, string];
type ProxyList = ProxyItem[];
type ProxyTargetList = Record<string, ProxyOptions & { rewrite: (path: string) => string }>;

const httpsRE = /^https:\/\//;
const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
};

// 处理replacement链接
function pathResolve(dir: string) {
  return resolve(__dirname, dir);
}

/**
 * @description: 处理env文件
 * @param {Recordable} envConf
 * @return {ViteEnv}
 */
// 将所有环境变量配置文件读取到 process.env
function wrapperEnv(envConf: Recordable): ViteEnv {
  const ret: any = {};

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n');
    realName = realName === 'true' ? true : realName === 'false' ? false : realName;

    if (envName === 'VITE_PORT') {
      realName = Number(realName);
    }
    if (envName === 'VITE_PROXY') {
      try {
        realName = JSON.parse(realName);
      } catch (error) {}
    }
    ret[envName] = realName;
    process.env[envName] = realName;
  }
  return ret;
}

/**
 * Generate proxy
 * @param list
 */
function createProxy(list: ProxyList = []) {
  const ret: ProxyTargetList = {};
  for (const [prefix, target] of list) {
    const isHttps = httpsRE.test(target);
    // https://github.com/http-party/node-http-proxy#options
    ret[prefix] = {
      target: target,
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
      // https is require secure=false
      ...(isHttps ? { secure: false } : {}),
    };
  }
  return ret;
}

// vite 配置
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const { VITE_APP_TITLE, VITE_PUBLIC_PATH, VITE_DROP_CONSOLE, VITE_PORT, VITE_PROXY, VITE_USE_MOCK } = viteEnv;
  const isBuild = command === 'build';
  const useMock = !!VITE_USE_MOCK;
  console.log(useMock);
  // 输出文件夹
  const OUTPUT_DIR = 'dist-manage';
  const ASSETS_DIR = 'static';

  return {
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        '@': pathResolve('src'),
        '/#/': pathResolve('types'),
      },
      dedupe: ['vue'],
    },
    plugins: [
      // @vitejs/plugin-vue
      vue(),
      // @vitejs/plugin-vue-jsx
      vueJsx(),
      // vite-plugin-html
      html({
        minify: isBuild, // 压缩index.html代码
        inject: {
          // 将数据注入ejs模板
          injectData: {
            title: VITE_APP_TITLE,
          },
        },
      }),
      // vite-plugin-mock
      viteMockServe({
        // ↓忽略以_开头的文件
        ignore: /^\_/,
        // ↓解析根目录下的mock文件夹
        mockPath: 'mock', //mock文件地址
        localEnabled: useMock, // 开发打包开关
        prodEnabled: useMock, // 生产环境打包开关
        // 这样可以控制关闭mock的时候不让mock打包到最终代码内
        injectCode: `
           import { setupProdMockServer } from '../mock/_createProductionServer';
     
           setupProdMockServer();
           `,
        logger: false, //是否在控制台显示请求日志
        supportTs: false, //打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件
      }),
    ],
    // 定义全局常量替换方式。
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/styles/variable.scss";', // 添加公共样式
        },
      },
    },
    server: {
      host: true,
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY),
    },
    // 依赖优化选项
    optimizeDeps: {
      include: [],
      exclude: ['vue-demi'],
    },
    // 打包
    build: {
      target: 'es2015',
      outDir: OUTPUT_DIR,
      assetsDir: ASSETS_DIR,
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: VITE_DROP_CONSOLE,
        },
      },
      brotliSize: false,
      chunkSizeWarningLimit: 2000,
    },
  };
};
