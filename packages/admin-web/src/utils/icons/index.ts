import { h } from 'vue';
import { NIcon } from 'naive-ui';
import * as Antd from './antd';
import * as Ionicons5 from './ionicons5';
import { IconsType, RenderIconType } from '/#/utils/icon';

export * from './antd';
export * from './ionicons5';

const iconsObj: IconsType = { ...Antd, ...Ionicons5 };

/**
 * render 图标
 * */
export const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};
export const hIcon = (icon: Component) => {
  return renderIcon(icon)();
};

// 前端路由图标映射表-函数图标
export const constantRouterIcon = ((): IconsType => {
  const routerObj: IconsType = {};
  for (const key in iconsObj) {
    routerObj[key] = renderIcon(iconsObj[key]);
  }
  return routerObj;
})();

//前端路由图标映射表-vue html图标
export const constantHtmlIcon = ((): RenderIconType => {
  const iconObj: RenderIconType = {};
  for (const key in iconsObj) {
    iconObj[key] = hIcon(iconsObj[key]);
  }
  return iconObj;
})();

// Antd图标映射表-vue html图标
export const constantAntdHtmlIcon = ((): RenderIconType => {
  const iconObj: RenderIconType = {};
  const obj: IconsType = Antd;
  for (const key in obj) {
    iconObj[key] = hIcon(obj[key]);
  }
  return iconObj;
})();

// Ionicons5图标映射表-vue html图标
export const constantIonicons5HtmlIcon = ((): RenderIconType => {
  const iconObj: RenderIconType = {};
  const obj: IconsType = Ionicons5;
  for (const key in obj) {
    iconObj[key] = hIcon(obj[key]);
  }
  return iconObj;
})();
