export interface UserAvatarItem {
  url: string;
  key: string;
  status: 'finished';
}

export interface UserItemForm {
  nickname: null | string;
  avatar: UserAvatarItem[] | never[];
  username: null | string;
  roleCode: null | string;
  password: null | string;
  verifyPassword: null | string;
}

export type UserItemKey = 'nickname' | 'avatar' | 'username' | 'roleCode' | 'password' | 'verifyPassword';
