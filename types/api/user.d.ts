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
export interface ApiUserInfo extends Omit<ApiUser, 'password'>,ApiUserId {
  // 角色名称
  roleName: string;
}
