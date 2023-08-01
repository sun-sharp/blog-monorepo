// 登录传参
export interface ApiCapitalLoginData {
  username: string;
  password: string;
}

// 登录返回
export interface ApiCapitalLoginResult {
  token: string;
}

// 注册用户传参
export interface ApiCapitalSignUpData {
  nickname: string;
  avatar: string;
  username: string;
  roleCode: string;
  password: string;
}
