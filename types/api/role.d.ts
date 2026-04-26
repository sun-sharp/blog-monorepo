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

/**
 * @description: 角色列表查询传参
 */
export type ApiRoleSearchParams = {
  name?: string;
  roleCode?: string;
};

/**
 * @description: 分页查询角色列表传参
 */
export type ApiRolePageData = ApiPaginateParams & ApiRoleSearchParams;

// 新增角色传参
export type ApiRoleSaveData = ApiRole;

// 修改角色传参
export interface ApiRoleUpdateData extends ApiRoleSaveData, ApiRoleId {}

/**
 * @description: SwaggerApi.json数据中的接口请求方式
 */
export type ApiSwaggerJsonMethod = 'post' | 'get' | 'put' | 'delete';

/**
 * @description: SwaggerApi.json数据中的接口传参方式
 */
export type ApiSwaggerJsonMode = 'body' | 'query' | 'path';

/**
 * @description: SwaggerApi.json文件读取之后数据的回显
 */
export interface ApiSwaggerJsonResult {
  // 接口路径
  url: string;
  // 接口请求方式
  method: ApiSwaggerJsonMethod;
  // 接口唯一值
  operationId?: string;
  // 接口标签，控制器
  tagId?: string;
  // 接口名称
  summary?: string;
  // 接口传参方式
  parameterTransferMode?: ApiSwaggerJsonMode[];
  // 标签名称
  tagName?: string;
  // 是否加密
  jwt?: true;
}

/**
 * @description: SwaggerApi.json文件读取之后数据的回显
 */
export interface ApiSwaggerJsonAllAssociateResult {
  // 接口标签，控制器
  tagId: string;
  // 标签名称
  tagName: string;
  // 下级接口
  children: ApiSwaggerJsonResult[];
}
