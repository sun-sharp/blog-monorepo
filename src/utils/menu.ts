import { PageEnum } from '@/enums';
import { cloneDeep } from 'lodash-es';

/**
 * 排除Router
 * */
export function filterRouter(routerMap: Array<any>) {
  return routerMap.filter((item) => {
    return (item.meta?.hidden || false) != true && !['/:path(.*)*', '/', PageEnum.REDIRECT_PATH, PageEnum.LOGIN_PATH].includes(item.path);
  });
}

/**
 * 递归组装菜单格式
 */
export function generatorMenu(routerMap: Array<any>) {
  return filterRouter(routerMap).map((item) => {
    const info = item;
    const currentMenu = {
      ...info,
      ...info.meta,
      label: info.meta?.title,
      key: info.name,
      icon: info.meta?.icon,
    };
    // 是否有子菜单，并递归处理
    if (info.children && info.children.length > 0) {
      // Recursion
      currentMenu.children = generatorMenu(info.children);
    }
    return currentMenu;
  });
}

/**
 * 混合菜单
 * */
export function generatorMenuMix(routerMap: Array<any>, routerName: string, location: string) {
  const cloneRouterMap = cloneDeep(routerMap);
  const newRouter = filterRouter(cloneRouterMap);
  if (location === 'header') {
    return getChildrenMix(newRouter);
  } else {
    return getChildrenRouter(newRouter.filter((item) => item.name === routerName));
  }
}

/**
 * 混合菜单获取最底层的菜单
 * */
export function getChildrenMix(newArr) {
  const firstRouter: any[] = [];
  filterRouter(newArr).forEach((item) => {
    const currentMenu = {
      icon: item.meta?.icon,
      label: item.meta?.title,
      key: item.name,
      children: item.children,
    };
    if (currentMenu.children && currentMenu.children.length > 0) {
      currentMenu.children = getChildrenMix(currentMenu.children);
    }
    firstRouter.push(currentMenu);
  });
  return firstRouter;
}

/**
 * 递归组装子菜单
 * */
export function getChildrenRouter(routerMap: Array<any>) {
  return filterRouter(routerMap).map((item) => {
    const info = item;
    const currentMenu = {
      ...info,
      ...info.meta,
      label: info.meta?.title,
      key: info.name,
    };
    // 是否有子菜单，并递归处理
    if (info.children && info.children.length > 0) {
      // Recursion
      currentMenu.children = getChildrenRouter(info.children);
    }
    return currentMenu;
  });
}
