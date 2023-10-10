import { ApiPaginateParams } from './common';

/**
 * @description: 角色的id
 */
export interface ApiRoleId {
  // 角色id
  roleId: string;
}

/**
 * @description: 角色的数据字段
 */
export interface ApiRole {
  // 角色名
  name: string;
  // 角色唯一标识
  roleCode: string;
  // 角色类型
  roleType: number;
  // 角色菜单权限
  menuPermission: Array<string>;
  // 角色api权限
  apiPermission: Array<string>;
}

/**
 * @description: 角色的列表每项
 */
export interface ApiRoleItem extends ApiRole, ApiRoleId {}

// 分页查询角色列表传参
export interface ApiRolePageData extends ApiPaginateParams {
  name: string;
  roleCode: string;
}

// 新增角色传参
export interface ApiRoleSaveData {
  name: string;
  roleCode: string;
  roleType: number;
  apiPermission: Array<string>;
}

// 修改角色传参
export interface ApiRoleUpdateData extends ApiRoleSaveData, ApiRoleId {}
