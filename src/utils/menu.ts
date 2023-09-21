import { IframeComponent, LayoutRouterView } from '@/router/router-component';
import { constantRouterIcon } from './icons';
import { ApiMenuItem } from '/#/api/menu';
import { AppRouteRecordRaw, MenuRouteItem } from '/#/router';
import { PAGE_ENUM } from '@/constant';
import { NaiveMenuOption } from '/#/plugins/naive';
import { cloneDeep } from 'lodash-es';

/**
 * 对路由的path进行处理
 * @param component
 * @return {*}
 *  */
export const pathFormat = (item: ApiMenuItem): string => {
  const { component, name = '' } = item;
  let path: string;
  if (component.indexOf('/') !== -1) {
    // console.log(component, 'component');
    path = component.replace('/index', '');
    path = (path.match(/\/\\/g) || []).length === 0 ? path : path.replace(/(.*)[/]/, '$1-');
  } else {
    path = `/${name.toLowerCase()}`;
  }
  // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
  path = path.replace('//', '/');
  return path;
};

/**
 * 动态导入vue页面
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
export const formatRouteComponent = (component: string, iframeSrc: string) => {
  let newComponent: Component | string;
  if (component.indexOf('/') >= 0) {
    newComponent = dynamicImport(viewsModules, component as string);
  } else if (iframeSrc) {
    newComponent = IframeComponent;
  } else {
    newComponent = LayoutRouterView;
  }
  return newComponent;
};

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 * @param routerMap
 * @param routerMap
 * @param _parentId
 * @returns {*}
 */
export const routerGenerator = (routerMap: MenuRouteItem[], _parentId = '0'): AppRouteRecordRaw[] => {
  const resultArr: AppRouteRecordRaw[] = [];
  routerMap.forEach((i) => {
    const { path, menuId, name, component, parentId, ...other } = i;
    if (_parentId === parentId) {
      const currentRouter: AppRouteRecordRaw = {
        // 路由地址 动态拼接生成如 /dashboard/workplace
        path,
        // 路由名称，建议唯一
        name: name || '',
        // 该路由对应页面的 组件
        component,
        // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
        meta: {
          ...other,
          icon: constantRouterIcon[other.icon] || null,
        },
      };
      // 是否有子菜单，并递归处理
      const itemChildren = routerGenerator(routerMap, menuId);
      if (itemChildren && itemChildren.length > 0) {
        //如果未定义 redirect 默认第一个子路由为 redirect
        currentRouter.redirect = `${itemChildren[0].path}`;
        // Recursion
        currentRouter.children = itemChildren;
      }
      resultArr.push(currentRouter);
    }
  });
  return resultArr;
};

/**
 * 处理路由表
 * @param routerMap
 * @returns {*}
 */
export const routerScreen = (routerMap: ApiMenuItem[]): AppRouteRecordRaw[] => {
  return routerGenerator(
    routerMap
      .map((m) => {
        const path = pathFormat(m);
        const component = formatRouteComponent(m.component, m.iframeSrc);
        return {
          ...m,
          path,
          component,
        };
      })
      // 判断连接，组件页面是否为空
      .filter((f) => f.path && f.component)
  );
};

/**
 * 排除Router
 * */
export const filterRouter = (routerMap: AppRouteRecordRaw[]): AppRouteRecordRaw[] => {
  return routerMap.filter((item) => {
    return (item.meta?.hidden || false) != true && !['/:path(.*)*', '/', PAGE_ENUM.REDIRECT_PATH, PAGE_ENUM.LOGIN_PATH].includes(item.path);
  });
};

/**
 * @description: 递归组装菜单格式
 * @param {AppRouteRecordRaw[]} list
 */
export const generatorMenu = (list: AppRouteRecordRaw[]): NaiveMenuOption[] => {
  return filterRouter(list).map((m) => {
    const currentMenu: NaiveMenuOption = {
      // 是否禁用菜单项
      disabled: false,
      // 菜单项的图标
      icon: m.meta?.icon,
      // 菜单项的标识符
      key: m.name,
      // 菜单项的内容
      label: m.meta?.title,
      // 是否显示菜单项
      show: !m.meta?.hidden,
    };
    // 是否有子菜单，并递归处理
    if (m.children && m.children.length > 0) {
      currentMenu.children = generatorMenu(m.children);
    } else if (m.meta?.menuType === 1) {
      currentMenu.children = [];
    }
    return currentMenu;
  });
};

/**
 * @description: 混合菜单
 * @param {AppRouteRecordRaw[]} list
 */
export const generatorMenuMix = (list: AppRouteRecordRaw[], routerName: string): NaiveMenuOption[] => {
  console.log(list, 'generatorMenuMix');
  console.log(routerName, 'generatorMenuMix_routerName');
  const cloneListMap = cloneDeep(list);
  console.log(cloneListMap, 'sdfd');

  // const newRouter = filterRouter(cloneRouterMap);

  return [];
};

/**
 * @description: 对菜单进行排序
 * @param {AppRouteRecordRaw[]} list
 */
export const sortRouteMenu = (list: AppRouteRecordRaw[]): AppRouteRecordRaw[] => {
  const routeList = list;
  routeList.sort((a: AppRouteRecordRaw, b: AppRouteRecordRaw) => (a.meta?.sort || 0) - (b.meta?.sort || 0));
  routeList.forEach((i: AppRouteRecordRaw) => {
    const item = i;
    if (item.children && item.children.length > 0) {
      item.children = sortRouteMenu(item.children);
    }
    return item;
  });
  return routeList;
};
