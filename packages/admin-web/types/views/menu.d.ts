import { ApiMenuItem } from '/#/api/menu';

/**
 * @description: 用户的数据字段
 */
export interface ViewsMenu extends Omit<ApiMenuItem, 'icon'> {
  // 菜单的图标
  icon: Component;
}
