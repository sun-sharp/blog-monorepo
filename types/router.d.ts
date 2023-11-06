import type { RouteRecordRaw, RouteMeta } from 'vue-router';
import { RouteLocationNormalized } from 'vue-router';
import { ApiMenu, ApiMenuId } from '/#/api/menu';

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'children'> {
  path: string;
  name: string;
  meta?: meta;
  component?: Component | string;
  children?: AppRouteRecordRaw[];
}

export interface Meta extends RouteMeta {
  // 名称
  title: string;
  // 是否忽略权限
  ignoreAuth?: boolean;
  // 是否缓存
  keepAlive?: boolean;
  // 是否固定在tab上
  affix?: boolean;
  // tab上的图标
  icon?: string;
  // 跳转地址
  iframeSrc?: string;
  // 外链跳转地址
  externalLink?: string;
  //隐藏
  hidden?: boolean;
  // 排序
  sort?: number;
}

export type RouteItem = Partial<RouteLocationNormalized> & {
  fullPath: string;
  name: string;
};

/**
 * @description: 菜单的列表每项
 */
export interface MenuRouteItem extends ApiMenu, ApiMenuId {
  path: string;
}
