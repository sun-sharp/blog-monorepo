import { IframeComponent, Layout } from '@/router/router-component';
import { constantRouterIcon } from './icons';
import { ApiLevelMenuItem, ApiMenuItem } from '/#/api/menu';
import { AppRouteRecordRaw } from '/#/router';
import { EMBEDDED_VALUE, MAIN_DIRECTORY_VALUE, MENU_VALUE, PAGE_ENUM } from '@/constant';
import { NaiveMenuOption } from '/#/plugins/naive';
import { cloneDeep } from 'lodash-es';
import { toUnderscoreCase } from './string';
import { PageRoute } from '@/router/base';

/**
 * 对路由的path进行处理
 * @param component
 * @return {*}
 *  */
export const pathFormat = (component: string = '', name: string = ''): string => {
  let path: string;
  if (component.indexOf('/') !== -1) {
    path = toUnderscoreCase(component).replace('/index', '');
    path = (path.match(/\/\\/g) || []).length === 0 ? path : path.replace(/(.*)[/]/, '$1-');
  } else {
    path = `/${name.toLowerCase()}`;
  }
  // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
  path = path.replace('//', '/');
  return path;
};

/**
 * @description: 动态导入vue页面
 * */
export const dynamicImport = (viewsModules: Record<string, () => Promise<Recordable>>, component: string) => {
  const keys = Object.keys(viewsModules);
  const matchKeys = keys.filter((key) => {
    let k = key.replace('../views', '');
    const lastIndex = k.lastIndexOf('.');
    k = k.substring(0, lastIndex);
    return k === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return viewsModules[matchKey];
  }
  if (matchKeys?.length > 1) {
    console.warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure'
    );
    return;
  }
};

/**
 * @description: 查找views中对应的组件文件
 * @param {string} component
 * @param {string} iframeSrc
 */
const viewsModules: Record<string, () => Promise<Recordable>> = import.meta.glob('../views/**/*.{vue,tsx}');
export const formatRouteComponent = (component: string = '', iframeSrc?: string) => {
  let newComponent: Component | string;
  if (component.indexOf('/') >= 0) {
    newComponent = dynamicImport(viewsModules, component as string);
  } else if (iframeSrc) {
    newComponent = IframeComponent;
  }
  return newComponent;
};

/**
 * @description: 处理单个路由对象
 * @param {ApiMenuItem} obj
 * @return {*}
 */
export const formatRouteItem = (obj: ApiMenuItem, parentId = '0'): AppRouteRecordRaw => {
  const { name, component, iframeSrc, hidden, keepAlive, menuType, sort, title, icon } = obj;
  const path = pathFormat(component, name);
  const currentRouter: AppRouteRecordRaw = {
    // 路由地址 动态拼接生成如 /dashboard/workplace
    path,
    // 路由名称，建议唯一
    name: name || '',
    // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
    meta: {
      hidden,
      keepAlive,
      menuType,
      sort,
      title,
      icon: icon ? constantRouterIcon[icon] : null,
    },
  };
  // 该路由对应页面的 组件
  let newComponent = formatRouteComponent(component, iframeSrc);
  if (parentId === '0') {
    newComponent = Layout;
  }
  if (newComponent) {
    currentRouter.component = newComponent;
  }
  return currentRouter;
};

/**
 * @description: 格式化 后端 结构信息并递归生成层级路由表
 * @param routerList
 * @param _parentId
 * @returns {*}
 */
export const routerGenerator = (routerList: ApiMenuItem[], _parentId = '0'): AppRouteRecordRaw[] => {
  const resultList: AppRouteRecordRaw[] = [];
  routerList.forEach((i) => {
    const { menuId, parentId } = i;
    if (parentId === _parentId) {
      const currentRouter: AppRouteRecordRaw = formatRouteItem(i, parentId);
      // 处理子菜单，并递归
      const itemChildren = routerList.filter((f) => f.parentId === menuId);
      if (itemChildren && itemChildren.length > 0) {
        // Recursion
        currentRouter.children = routerGenerator(routerList, menuId);
        // 如果未定义 redirect 默认第一个子路由为 redirect
        currentRouter.redirect = `${currentRouter.children[0].path}`;
      }
      resultList.push(currentRouter);
    }
  });
  return resultList;
};

/**
 * @description: 对路由进行分类
 * @param {AppRouteRecordRaw[]} routeList
 * @return {AppRouteRecordRaw[]}
 */
export const routerClassify = (routeList: AppRouteRecordRaw[]): AppRouteRecordRaw[] => {
  const isOneRoute = (item: AppRouteRecordRaw) => !item.children && !item.redirect;
  const oneRouters: AppRouteRecordRaw[] = [];
  const otherRouters: AppRouteRecordRaw[] = [];
  routeList.forEach((f) => {
    if (isOneRoute(f)) {
      oneRouters.push(f);
    } else {
      otherRouters.push(f);
    }
  });
  PageRoute.children = oneRouters;
  return [PageRoute, ...otherRouters];
};

/**
 * @description: 处理路由表
 * @param menuData
 */
export const routerScreen = (menuData: ApiMenuItem[]): AppRouteRecordRaw[] => {
  // 获取（目录，菜单，内嵌）的数据
  const routerList = menuData.filter((f) => [MAIN_DIRECTORY_VALUE, MENU_VALUE, EMBEDDED_VALUE].includes(f.menuType));
  // .map((m) => {
  //
  //   const component = formatRouteComponent(m.component, m.iframeSrc);
  //   return {
  //     ...m,
  //     path,
  //     component,
  //   };
  // })
  console.log(routerGenerator(routerList), 'routerGenerator(routerList)');

  return routerGenerator(routerList);
};

/**
 * 将数组菜单组合成多层菜单
 */
export const levelMenu = (menuMap: ApiMenuItem[], parentId: string | number = '0') => {
  const menuArr: ApiLevelMenuItem[] = [];
  menuMap.forEach((i) => {
    const item: ApiLevelMenuItem = i;
    // 查找上级菜单
    const menuFind = menuMap.find((f) => f.menuId === item.parentId);
    if (item.parentId === parentId) {
      // 是否有子菜单，并递归处理
      const itemChildren = levelMenu(menuMap, item.menuId);
      if (itemChildren && itemChildren.length > 0) {
        // 添加子数据
        item.children = itemChildren;
      }
      // 添加上级菜单的名称
      if (menuFind) {
        item.parentName = menuFind.title;
      }
      menuArr.push(item);
    } else if (parentId === '0') {
      // 判断这个菜单是否没有上级
      if (!menuFind) {
        item.parentName = '查询的数据没有上级菜单';
        menuArr.push(item);
      }
    }
  });
  return menuArr;
};

/**
 * @description: 递归组装菜单格式
 * @param {ApiLevelMenuItem[]} list
 */
export const generatorMenu = (list: ApiLevelMenuItem[]): NaiveMenuOption[] => {
  return list.map((m) => {
    const currentMenu: NaiveMenuOption = {
      // 是否禁用菜单项
      disabled: false,
      // 菜单项的图标
      icon: m.icon ? constantRouterIcon[m.icon] : null,
      // 菜单项的标识符
      key: m.name,
      // 菜单项的内容
      label: m.title,
      // 是否显示菜单项
      show: !m.hidden,
      path: pathFormat(m.component, m.name),
    };
    // 是否有子菜单，并递归处理
    if (m.children && m.children.length > 0) {
      currentMenu.children = generatorMenu(m.children);
    }
    return currentMenu;
  });
};

/**
 * @description: 混合菜单获取对应的菜单
 * */
export function getChildrenMix(newArr: ApiLevelMenuItem[], routerName: string): NaiveMenuOption[] {
  const firstRouter: NaiveMenuOption[] = [];
  newArr.forEach((m) => {
    const currentMenu: NaiveMenuOption = {
      // 是否禁用菜单项
      disabled: false,
      // 菜单项的图标
      icon: m.icon ? constantRouterIcon[m.icon] : null,
      // 菜单项的标识符
      key: m.name,
      // 菜单项的内容
      label: m.title,
      // 是否显示菜单项
      show: !m.hidden,
      path: pathFormat(m.component, m.name),
    };
    if (m.name !== routerName) {
      if (m.children && m.children.length > 0) {
        currentMenu.children = getChildrenMix(m.children, routerName);
        if (currentMenu.children.length > 0) firstRouter.push(currentMenu);
      } else {
        firstRouter.push(currentMenu);
      }
    }
  });
  return firstRouter;
}

/**
 * @description: 混合菜单获取对应的整体菜单
 * */
export function getCurrentChildrenMix(newArr: ApiLevelMenuItem[], routerName: string): NaiveMenuOption[] {
  const firstRouter: NaiveMenuOption[] = [];
  newArr.forEach((m) => {
    const currentMenu: NaiveMenuOption = {
      // 是否禁用菜单项
      disabled: false,
      // 菜单项的图标
      icon: m.icon ? constantRouterIcon[m.icon] : null,
      // 菜单项的标识符
      key: m.name,
      // 菜单项的内容
      label: m.title,
      // 是否显示菜单项
      show: !m.hidden,
      path: pathFormat(m.component, m.name),
    };
    if (m.name === routerName) {
      firstRouter.push(currentMenu);
      return true;
    } else if (m.children && m.children.length > 0) {
      currentMenu.children = getCurrentChildrenMix(m.children, routerName);
      if (currentMenu.children.length > 0) firstRouter.push(currentMenu);
    }
  });
  return firstRouter;
}

/**
 * @description: 混合菜单
 * @param {AppRouteRecordRaw[]} list
 */
export const generatorMenuMix = (list: ApiLevelMenuItem[], routerName: string, mode: string): NaiveMenuOption[] => {
  const cloneListMap = cloneDeep(list);
  if (mode === 'horizontal') {
    return getCurrentChildrenMix(cloneListMap, routerName);
  }
  return getChildrenMix(cloneListMap, routerName);
};

/**
 * @description: 对菜单进行排序
 * @param {ApiLevelMenuItem[]} list
 */
export const sortLevelMenu = (list: ApiLevelMenuItem[]): ApiLevelMenuItem[] => {
  const routeList = list;
  routeList.sort((a, b) => (a.sort || 0) - (b.sort || 0));
  routeList.forEach((i) => {
    const item = i;
    if (item.children && item.children.length > 0) {
      item.children = sortLevelMenu(item.children);
    }
    return item;
  });
  return routeList;
};

/**
 * @description: 处理动态菜单
 * @param {ApiMenuItem[]} menuData
 */
export const formatTrendsMenus = (menuData: ApiMenuItem[]): ApiLevelMenuItem[] => {
  const homeMenuItem: ApiLevelMenuItem = {
    hidden: false,
    icon: PAGE_ENUM.HOME_ICON,
    menuId: '001',
    menuType: MENU_VALUE,
    name: PAGE_ENUM.HOME_NAME,
    parentId: '0',
    sort: 0,
    title: PAGE_ENUM.HOME_TITLE,
  };
  const trendsMenus = sortLevelMenu(levelMenu(menuData));
  return [homeMenuItem, ...trendsMenus];
};
