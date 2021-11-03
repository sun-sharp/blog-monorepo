import { adminMenus } from '@/api/system/menu';
import { constantRouterIcon } from '@/utils/icons';
import { RouteRecordRaw } from 'vue-router';
import { Layout, ParentLayout } from '@/router/constant';
import type { AppRouteRecordRaw } from '@/router/types';
// import { number } from 'echarts';

const Iframe = () => import('@/views/iframe/index.vue');
const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>();

LayoutMap.set('LAYOUT', Layout);
LayoutMap.set('IFRAME', Iframe);

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 * @param routerMap
 * @param _id
 * @param path
 * @returns {*}
 */
export const routerGenerator = (routerMap, _parentId): any[] => {
  const resultArr: any[] = [];
  routerMap.forEach((i) => {
    const { _id, path, name, component, parentId, ...other } = i;
    if (_parentId === parentId) {
      const currentRouter: any = {
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
      // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
      currentRouter.path = currentRouter.path.replace('//', '/');
      // 是否有子菜单，并递归处理
      const itemChildren = routerGenerator(routerMap, _id);
      if (itemChildren && itemChildren.length > 0) {
        //如果未定义 redirect 默认第一个子路由为 redirect
        currentRouter.redirect = `${path}/${itemChildren[0].path}`;
        // Recursion
        currentRouter.children = itemChildren;
      }
      resultArr.push(currentRouter);
    }
  });
  return resultArr;
};

/**
 * 查找views中对应的组件文件
 * */
let viewsModules: Record<string, () => Promise<Recordable>>;
export const asyncImportRoute = (routes: AppRouteRecordRaw[] | undefined): any[] => {
  viewsModules = viewsModules || import.meta.glob('../views/**/*.{vue,tsx}');
  if (!routes) return [];
  return routes.map((i) => {
    const item = i;
    if (!item.component && item.meta?.iframeSrc) {
      item.component = 'IFRAME';
    }
    if (item.component) {
      const layoutFound = LayoutMap.get(item.component as string);
      if (layoutFound) {
        item.component = layoutFound;
      } else {
        item.component = dynamicImport(viewsModules, item.component as string);
      }
    } else if (item.name) {
      item.component = ParentLayout;
    }
    item.children && (item.children = asyncImportRoute(item.children));
    return item;
  });
};

/**
 * 将一级菜单从获得的数据中筛选出来
 * @param routerMap
 * @returns {*}
 */
export const routerOneScreen = (routerMap): any => {
  const oneRouteList: any[] = [];
  const routeList: any[] = [];
  routerMap.forEach((item) => {
    if (item.component && !LayoutMap.get(item.component as string) && item.parentId == '0') {
      oneRouteList.push(item);
    } else {
      routeList.push(item);
    }
  });
  return {
    oneRouteList: asyncImportRoute(routerGenerator(oneRouteList, '0')),
    routeList: asyncImportRoute(routerGenerator(routeList, '0')),
  };
};

/**
 * 动态生成菜单
 * @param roleCode
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (roleCode: string): Promise<RouteRecordRaw[]> => {
  return new Promise((resolve, reject) => {
    adminMenus({ roleCode })
      .then((result) => {
        resolve(routerOneScreen(result));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * 动态导入
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
