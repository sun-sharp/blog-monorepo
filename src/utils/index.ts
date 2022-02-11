import { h, unref } from 'vue';
import type { App, Plugin } from 'vue';
import { NIcon } from 'naive-ui';
import { PageEnum } from '@/enums';
import { isObject } from './is/index';
import { cloneDeep } from 'lodash-es';
/**
 * render 图标
 * */
export const renderIcon = (icon) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};
export const hIcon = (icon) => {
  return renderIcon(icon)();
};

// /**
//  * render new Tag
//  * */
// const newTagColors = { color: '#f90', textColor: '#fff', borderColor: '#f90' };
// export function renderNew(type = 'warning', text = 'New', color: object = newTagColors) {
//   return () =>
//     h(
//       NTag as any,
//       {
//         type,
//         round: true,
//         size: 'small',
//         color,
//       },
//       { default: () => text }
//     );
// }

/**
 * 将数组menu组合成多层数组
 */
export const levelMenu = (menuMap: Array<any>, parentId: string | number = '0') => {
  const menuArr: any[] = [];
  menuMap.forEach((i) => {
    const item = i;
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

/**
 * 排除Router
 * */
export function filterRouter(routerMap: Array<any>) {
  return routerMap.filter((item) => {
    return (item.meta?.hidden || false) != true && !['/:path(.*)*', '/', PageEnum.REDIRECT_PATH, PageEnum.LOGIN_PATH].includes(item.path);
  });
}

/**
 * 安装全局变量
 * */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any;
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as T & Plugin;
};

/**
 *  找到对应的节点
 * */
let result = null;
export function getTreeItem(data: any[], key?: string | number): any {
  data.map((item) => {
    if (item.key === key) {
      result = item;
    } else {
      if (item.children && item.children.length) {
        getTreeItem(item.children, key);
      }
    }
  });
  return result;
}

// /**
//  *  找到所有节点
//  * */
// const treeAll: any[] = [];
// export function getTreeAll(data: any[]): any[] {
//   data.map((item) => {
//     treeAll.push(item.key);
//     if (item.children && item.children.length) {
//       getTreeAll(item.children);
//     }
//   });
//   return treeAll;
// }

// dynamic use hook props
export function getDynamicProps<T, U>(props: T): Partial<U> {
  const ret: Recordable = {};

  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key]);
  });

  return ret as Partial<U>;
}

/**
 * 复制对象的元素到另一个对象里
 */
export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

export * from './storage';
export * from './color';
