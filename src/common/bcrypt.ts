import * as bcrypt from 'bcrypt';

/**
 * @description 验证密码
 * @param {string} password
 * @param {string} hashPassword
 * @return {Promise<boolean>}
 */
export async function comparePassword(password: string, hashPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashPassword);
}

/**
 * @description 给密码加密
 * @param {string} password
 * @return {Promise<boolean>}
 */
export async function hashPassword(password: string): Promise<string> {
  const saltOrRounds = 10;
  return await bcrypt.hash(password, saltOrRounds);
}
