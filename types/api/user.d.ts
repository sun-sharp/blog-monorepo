import { ApiPaginateParams } from './common';

/**
 * @description: 用户的id
 */
export interface ApiUserId {
  // 用户id
  userId: string;
}

/**
 * @description: 用户的数据字段
 */
export interface ApiUser {
  // 昵称
  nickname: string;
  // 用户头像
  avatar: string;
  // 账号名
  username: string;
  // 密码
  password: string;
  // 上次登录时间
  loginDate: string;
  // 角色类型
  roleCode: string;
}

/**
 * @description: 用户信息
 */
export interface ApiUserInfo extends Omit<ApiUser, 'password'>, ApiUserId {
  // 角色名称
  roleName: string;
}

/**
 * @description: 用户的列表每项
 */
export interface ApiUserItem extends ApiUser, ApiUserId {}

/**
 * @description: 分页查询用户列表传参
 */
export interface ApiUserPageData extends ApiPaginateParams {
  // 昵称
  nickname: string;
  // 用户名
  username: string;
}

/**
 * @description: 修改用户角色传参
 */
export interface ApiUserUpdateRoleCodeData extends ApiUserId {
  // 角色类型
  roleCode: string;
}

/**
 * @description: 修改用户信息传参
 */
export interface ApiUserUpdateUserInfoData {
  // 昵称
  nickname: string;
  // 用户名
  username: string;
  // 用户头像
  avatar: string;
}

/**
 * @description: 用户图片
 */
export interface UserAvatarItem {
  url: string;
  key: string;
  status: 'finished';
}

/**
 * @description: 修改用户信息表单
 */
export interface UserUpdateUserInfoForm {
  // 昵称
  nickname: string;
  // 用户名
  username: string;
  // 用户头像
  avatar: UserAvatarItem[];
}

/**
 * @description: 修改用户信息表单
 */
export interface UserUpdateUserPassword {
  // 原密码
  password: string;
  // 新密码
  updatePassword: string;
}

/**
 * @description: 用户表单
 */
export interface UserItemForm {
  nickname: null | string;
  avatar: UserAvatarItem[];
  username: null | string;
  roleCode: null | string;
  password: null | string;
  verifyPassword: null | string;
}

/**
 * @description: 用户选择类型
 */
export type UserItemKey = 'nickname' | 'avatar' | 'username' | 'roleCode' | 'password' | 'verifyPassword';
