import type { UserConfig, ConfigEnv } from 'vite';
import { loadEnv } from 'vite';
import { resolve } from 'path';
import pkg from './package.json';
import { format } from 'date-fns';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import html from 'vite-plugin-html';
import { createProxy } from './build/vite/proxy';
// import { viteMockServe } from 'vite-plugin-mock';

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
export function wrapperEnv(envConf: Recordable): ViteEnv {
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
 * @description: 处理代理数据
 */
// function createProxy(mode: string) {
//   const proxy = {
//     development: {
//       '/capital-api': 'http://127.0.0.1:3000/capital/',
//     },
//   };
//   return proxy[mode] || {};
// }

// vite 配置
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const { VITE_APP_TITLE, VITE_PUBLIC_PATH, VITE_DROP_CONSOLE, VITE_PORT, VITE_PROXY } = viteEnv;
  const isBuild = command === 'build';
  // 输出文件夹
  const OUTPUT_DIR = 'admin';
  // 在生产环境中输入的配置文件的名称
  const CONFIG_FILE_NAME = 'app.config.js';
  // 处理接口参数默认路径
  const getAppConfigSrc = () => {
    const path = VITE_PUBLIC_PATH.endsWith('/') ? VITE_PUBLIC_PATH : `${VITE_PUBLIC_PATH}/`;
    return `${path || '/'}${CONFIG_FILE_NAME}?v=${pkg.version}-${new Date().getTime()}`;
  };

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
          // 嵌入生成的app.config.js文件
          tags: isBuild
            ? [
                {
                  tag: 'script',
                  attrs: {
                    src: getAppConfigSrc(),
                  },
                },
              ]
            : [],
        },
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
