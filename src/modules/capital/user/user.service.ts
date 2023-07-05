import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { comparePassword, hashPassword } from 'src/common/bcrypt';
import { IResponse } from 'src/interfaces/response.interface';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { PageUserDto } from './dto/page-user.dto';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { User } from 'src/schemas/capital/user.schema';
import { nowDateFun } from 'src/common/date';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { imageIsHasHttpOrHttps } from 'src/common/validator/image-validator';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { RoleService } from '../role/role.service';

@Injectable()
export class UserService {
  private USERNAME_LENGTH_MAX = 10;
  private USERNAME_LENGTH_MIN = 3;
  response: IResponse;
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
  ) {}

  /**
   * @description 创建用户
   * @param {CreateUserDto} body
   * @return {Promise<IResponse>}
   */
  public create(body: CreateUserDto): Promise<IResponse> {
    return (
      Promise.resolve(body)
        // 判断username 是否为合法字符
        .then((body) => {
          const { username } = body;
          if (username.length > this.USERNAME_LENGTH_MAX || username.length < this.USERNAME_LENGTH_MIN)
            throw (this.response = {
              code: ApiCode.ERROR,
              message: `账号长度应为${this.USERNAME_LENGTH_MIN}-${this.USERNAME_LENGTH_MAX}`,
            });
          if (!/^[a-z][a-z_`~@*|()+-]{3,40}$/.test(username)) {
            throw (this.response = {
              code: ApiCode.ERROR,
              message: '账号不符合规定',
            });
          }
          return body;
        })
        // 判断用户名是否已存在
        .then(async (body) => {
          const { username } = body;
          const user = await this.userModel.findOne({ username });
          if (user)
            throw (this.response = {
              code: ApiCode.ERROR,
              message: '用户名已注册',
            });
          return body;
        })
        // 判断头像是否合理
        .then(async (body) => {
          const { avatar } = body;
          const hasHttpOrHttps = imageIsHasHttpOrHttps(avatar);
          if (hasHttpOrHttps)
            throw (this.response = {
              code: ApiCode.ERROR,
              message: '头像保存的不合理，请处理之后再上传！',
            });
          return body;
        })
        // 注册用户
        .then(async (body) => {
          const password = await hashPassword(body.password);
          const result = await this.userModel.create({
            ...body,
            password,
          });
          console.log(result._id);
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: result._id,
            message: '用户创建成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '创建用户失败！',
          });
        })
    );
  }

  /**
   * @description 运用username查找用户
   * @param {string} username
   * @return {Promise<User>}
   */
  public findOneByName(username: string): Promise<User> {
    return (
      Promise.resolve(username)
        // 判断username 是否为合法字符
        .then(async (username) => {
          return await this.userModel.findOne({ username });
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }

  /**
   * @description 运用avatar查找用户
   * @param {string} avatar
   * @return {Promise<User>}
   */
  public findOneByAvatar(avatar: string): Promise<User> {
    return (
      Promise.resolve(avatar)
        // 判断头像是否合理
        .then(async (avatar) => {
          const hasHttpOrHttps = imageIsHasHttpOrHttps(avatar);
          if (hasHttpOrHttps)
            throw (this.response = {
              code: ApiCode.ERROR,
              message: '头像保存的不合理，请处理之后再上传！',
            });
          return avatar;
        })
        // 判断username 是否为合法字符
        .then(async (avatar) => {
          return await this.userModel.findOne({ avatar });
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }

  /**
   * @description: 运用_id查找用户信息
   * @param {string} userId
   * @return {Promise<User>}
   */
  public findOneById(userId: string): Promise<IResponse> {
    return (
      Promise.resolve(userId)
        // 获取信息
        .then(async (userId) => {
          const user = await this.userModel.findOne({ _id: userId });
          const routeFind = await this.roleService.findOneByRoleCode(user.roleCode);
          if (!routeFind) {
            throw (this.response = {
              code: ApiCode.ERROR,
              message: '查询角色失败',
            });
          }
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: {
              userId: user._id,
              roleCode: user.roleCode,
              roleName: routeFind.name,
              loginDate: user.loginDate,
              username: user.username,
              avatar: user.avatar,
              nickname: user.nickname,
            },
            message: '查询成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '查询失败！',
          });
        })
    );
  }

  /**
   * @description: 条件并分页获取用户列表
   * @param {PageUserDto} body
   * @return {Promise<IResponse>}
   */
  public findPage(body: PageUserDto): Promise<IResponse> {
    return (
      Promise.resolve(body)
        // 分页查询
        .then(async (body) => {
          const { size, current, nickname, username } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData = { nickname: { $regex: nickname }, username: { $regex: username } };
          const total = await this.userModel.find(findData).count();
          const list = await this.userModel.find(findData).limit(limit).skip(skip);
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: {
              current,
              list: list.map((m) => ({
                userId: m._id,
                roleCode: m.roleCode,
                loginDate: m.loginDate,
                username: m.username,
                avatar: m.avatar,
                nickname: m.nickname,
              })),
              size,
              total,
            },
            message: '查询成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '查询失败！',
          });
        })
    );
  }

  /**
   * @description: 修改用户权限
   * @param {string} userId
   * @param {string} roleCode
   * @return {*}
   */
  public updateUserRole(userId: string, roleCode: string): Promise<IResponse> {
    return (
      Promise.resolve({ userId, roleCode })
        .then(async ({ userId, roleCode }) => {
          await this.userModel.updateOne({ _id: userId }, { roleCode });
          return (this.response = {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '修改失败！',
          });
        })
    );
  }

  /**
   * @description: 修改用户基本信息
   * @param {string} userId
   * @param {UpdateUserInfoDto} updateUserInfoDto
   * @return {*}
   */
  public updateUserInfo(userId: string, updateUserInfoDto: UpdateUserInfoDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body: updateUserInfoDto })
        // 判断头像是否合理
        .then(async ({ userId, body }) => {
          const { avatar } = body;
          const hasHttpOrHttps = imageIsHasHttpOrHttps(avatar);
          if (hasHttpOrHttps)
            throw (this.response = {
              code: ApiCode.ERROR,
              message: '头像保存的不合理，请处理之后再上传！',
            });
          return { userId, body };
        })
        // 修改用户基本信息
        .then(async ({ userId, body }) => {
          await this.userModel.updateOne({ _id: userId }, body);
          return (this.response = {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '修改失败！',
          });
        })
    );
  }

  /**
   * @description: 更新用户密码
   * @param {User} user
   * @param {UpdateUserPasswordDto} updateUserPasswordDto
   * @return {*}
   */
  public updateUserPassword(user: User, updateUserPasswordDto: UpdateUserPasswordDto): Promise<IResponse> {
    return (
      Promise.resolve({ user, body: updateUserPasswordDto })
        // 判断密码是否正确
        .then(async ({ user, body }) => {
          const verify = await comparePassword(body.password, user.password);
          if (!verify) {
            throw (this.response = {
              code: ApiCode.ERROR,
              message: '密码错误',
            });
          }
          return {
            userId: user._id,
            updatePassword: body.updatePassword,
          };
        })
        // 修改用户基本信息
        .then(async ({ userId, updatePassword }) => {
          const password = await hashPassword(updatePassword);
          await this.userModel.updateOne({ _id: userId }, { password });
          return (this.response = {
            code: ApiCode.SUCCESS,
            message: '修改密码成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '修改密码失败！',
          });
        })
    );
  }

  /**
   * @description: 删除用户
   * @param {string} userId
   * @return {*}
   */
  public remove(userId: string): Promise<IResponse> {
    return (
      Promise.resolve(userId)
        .then(async (userId) => {
          await this.userModel.deleteOne({ _id: userId });
          return (this.response = {
            code: ApiCode.SUCCESS,
            message: '删除成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '删除失败！',
          });
        })
    );
  }

  /**
   * @description: 修改登录时间
   * @param {string} userId
   * @return {*}
   */
  public updateLoginDate(userId: string): Promise<User> {
    return (
      Promise.resolve(userId)
        .then(async (userId) => {
          const loginDate = nowDateFun();
          return this.userModel.updateOne({ _id: userId }, { loginDate });
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }

  /**
   * @description: 校验 token
   * @param {string} token
   * @return {*}
   */
  verifyToken(token: string): Promise<string> {
    return (
      Promise.resolve(token)
        .then(async (token) => {
          if (!token) return '';
          const { _id } = this.jwtService.verify(token.replace('Bearer ', ''));
          return _id;
        })
        // 返回错误
        .catch(() => {
          return '';
        })
    );
  }

  /**
   * @description: 根据用户ID校验用户
   * @param {string} userId
   * @return {*}
   */
  async validateUserByUserId(userId: string): Promise<User | boolean> {
    return (
      Promise.resolve(userId)
        .then(async (userId) => {
          return await this.userModel.findOne({ _id: userId });
        })
        // 返回错误
        .catch(() => {
          return false;
        })
    );
  }
}
