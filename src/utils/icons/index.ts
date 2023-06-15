import { h } from 'vue';
import { NIcon } from 'naive-ui';
import * as Antd from './antd';
import * as Ionicons5 from './ionicons5';

export * from './antd';
export * from './ionicons5';

const iconsObj = { ...Antd, ...Ionicons5 };

/**
 * render 图标
 * */
export const renderIcon = (icon) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};
export const hIcon = (icon) => {
  return renderIcon(icon)();
};

// 前端路由图标映射表-函数图标
export const constantRouterIcon = (() => {
  const routerObj = {};
  Object.keys(iconsObj).forEach((key) => {
    routerObj[key] = renderIcon(iconsObj[key]);
  });
  return routerObj;
})();

//前端路由图标映射表-vue html图标
export const constantHtmlIcon = (() => {
  const routerObj = {};
  Object.keys(iconsObj).forEach((key) => {
    routerObj[key] = hIcon(iconsObj[key]);
  });
  return routerObj;
})();
