import { h } from 'vue';
import { NIcon } from 'naive-ui';
import * as Antd from './antd';
import * as Ionicons5 from './ionicons5';

export * from './antd';
export * from './ionicons5';

interface IconsType {
  [x: string]: any;
}

const iconsObj: IconsType = { ...Antd, ...Ionicons5 };

/**
 * render 图标
 * */
export const renderIcon = (icon: IconsType) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};
export const hIcon = (icon: IconsType) => {
  return renderIcon(icon)();
};

// 前端路由图标映射表-函数图标
export const constantRouterIcon = (() => {
  const routerObj: IconsType = {};
  for (const key in iconsObj) {
    routerObj[key] = renderIcon(iconsObj[key]);
  }
  return routerObj;
})();

//前端路由图标映射表-vue html图标
export const constantHtmlIcon = (() => {
  const routerObj: IconsType = {};
  for (const key in iconsObj) {
    routerObj[key] = hIcon(iconsObj[key]);
  }
  return routerObj;
})();

// Antd图标映射表-vue html图标
export const constantAntdHtmlIcon = (() => {
  const routerObj: IconsType = {};
  const obj: IconsType = Antd;
  for (const key in obj) {
    routerObj[key] = hIcon(obj[key]);
  }
  return routerObj;
})();

// Ionicons5图标映射表-vue html图标
export const constantIonicons5HtmlIcon = (() => {
  const routerObj: IconsType = {};
  const obj: IconsType = Ionicons5;
  for (const key in obj) {
    routerObj[key] = hIcon(obj[key]);
  }
  return routerObj;
})();
