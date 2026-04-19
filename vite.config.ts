import { ProxyOptions, defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';
import { format } from 'date-fns';
import pkg from './package.json';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import viteCompression from 'vite-plugin-compression';
import checker from 'vite-plugin-checker';
import ViteImagemin from 'vite-plugin-imagemin';
import { VitePWA } from 'vite-plugin-pwa';

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
};

/**
 * @description: 处理文件路径
 * @param {string} dir
 * @return {string}
 */
const pathResolve = (dir: string): string => {
  return resolve(process.cwd(), '.', dir);
};

/**
 * @description: 处理 env 文件（将所有环境变量配置文件读取到 process.env）
 * @param {Recordable} envConf
 * @return {ViteEnv}
 */
const wrapperEnv = (envConf: Recordable): ViteEnv => {
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
      } catch (error) {
        /* empty */
      }
    }
    ret[envName] = realName;
    process.env[envName] = realName;
  }
  return ret;
};

type ProxyItem = [string, string];
type ProxyList = ProxyItem[];
type ProxyTargetList = Record<string, ProxyOptions & { rewrite: (path: string) => string }>;
const httpsRE = /^https:\/\//;
/**
 * 创建 dev 运行跨越
 * @param list
 */
const createProxy = (list: ProxyList = []) => {
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
};

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const { VITE_APP_TITLE, VITE_PUBLIC_PATH, VITE_DROP_CONSOLE, VITE_PORT, VITE_PROXY } = viteEnv;
  const isBuild = command === 'build';
  // 输出文件夹
  const OUTPUT_DIR = 'home';
  const ASSETS_DIR = 'static';
  return {
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: [
        {
          find: '@',
          replacement: pathResolve('src') + '/',
        },
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
      dedupe: ['react', 'react-dom'],
    },
    plugins: [
      react(),
      // vite-plugin-svgr - SVG 组件支持
      svgr(),
      // vite-tsconfig-paths - 路径别名支持
      viteTsconfigPaths(),
      // vite-plugin-checker - TypeScript 类型检查（已禁用 eslint 检查，由独立 lint 命令处理）
      checker({
        typescript: true,
        overlay: {
          initialIsOpen: false,
        },
      }),
      // vite-plugin-html
      createHtmlPlugin({
        minify: isBuild, // 压缩 index.html 代码
        inject: {
          // 将数据注入 ejs 模板
          data: {
            title: VITE_APP_TITLE,
          },
        },
      }),
      // vite-plugin-compression - Gzip 压缩
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      // vite-plugin-imagemin - 图片压缩
      ViteImagemin({
        gifsicle: { optimizationLevel: 7, interlaced: false },
        optipng: { optimizationLevel: 7 },
        mozjpeg: { quality: 20 },
        pngquant: { quality: [0.8, 0.9], speed: 4 },
        svgo: { plugins: [{ name: 'removeViewBox' }] },
      }),
      // vite-plugin-pwa - PWA 支持
      VitePWA({
        registerType: 'manual',
        injectRegister: 'manual',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: VITE_APP_TITLE,
          short_name: VITE_APP_TITLE,
          description: '个人博客官方网站',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
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
          quietDeps: true,
        },
      },
    },
    server: {
      host: true,
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY),
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
      minify: 'terser',
      brotliSize: false,
      chunkSizeWarningLimit: 2000,
    },
    optimizeDeps: {
      include: ['antd', 'axios', 'react', 'react-dom', 'react-router-dom'],
    },
  };
});
