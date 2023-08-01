/**
 * @description: 菜单数据字段
 */
export interface ApiMenu {
  // 菜单的唯一标识
  name: string;
  // 菜单的名称
  title: string;
  // 上级菜单的id
  parentId: string;
  // 菜单类型
  menuType: number;
  // 菜单是否隐藏
  hidden: boolean;
  // 组件内容或地址
  component: string;
  // 菜单的排序
  sort: number;
  // 菜单的图标
  icon: string;
  // 内嵌iframe地址
  iframeSrc: string;
  // 外链跳转地址
  externalLink: string;
  // 是否不缓存
  noKeepAlive: boolean;
}

/**
 * @description: 菜单的id
 */
export interface ApiMenuId {
  // 菜单id
  menuId: string;
}

/**
 * @description: 菜单的列表每项
 */
export interface ApiMenuItem extends ApiMenu, ApiMenuId {}
