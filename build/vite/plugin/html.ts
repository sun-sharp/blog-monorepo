/**
 * 在index.html中最小化和使用ejs模板语法的插件。
 * https://github.com/anncwb/vite-plugin-html
 */
import type { Plugin } from 'vite';

import html from 'vite-plugin-html';

import pkg from '../../../package.json';
import { GLOB_CONFIG_FILE_NAME } from '../../constant';

export function configHtmlPlugin(env: ViteEnv, isBuild: boolean) {
  const { VITE_GLOB_APP_TITLE, VITE_PUBLIC_PATH } = env;

  const path = VITE_PUBLIC_PATH.endsWith('/') ? VITE_PUBLIC_PATH : `${VITE_PUBLIC_PATH}/`;

  const getAppConfigSrc = () => {
    return `${path || '/'}${GLOB_CONFIG_FILE_NAME}?v=${pkg.version}-${new Date().getTime()}`;
  };

  const htmlPlugin: Plugin[] = html({
    minify: isBuild, // 压缩index.html代码
    inject: {
      // 将数据注入ejs模板
      injectData: {
        title: VITE_GLOB_APP_TITLE,
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
  });
  return htmlPlugin;
}
