import * as bcrypt from 'bcrypt';

/**
 * @description 验证密码
 * @date 22/11/2021
 * @private
 * @param {string} password
 * @param {string} hashPassword
 * @return {*}  {Promise<boolean>}
 * @memberof UserService
 */
export async function comparePassword(password: string, hashPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashPassword);
}

/**
 * @description 给密码加密
 * @date 22/11/2021
 * @private
 * @param {string} password
 * @return {*}  {Promise<string>}
 * @memberof UserService
 */
export async function hashPassword(password: string): Promise<string> {
  const saltOrRounds = 10;
  return await bcrypt.hash(password, saltOrRounds);
}
