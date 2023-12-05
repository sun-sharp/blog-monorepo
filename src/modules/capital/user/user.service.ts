import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { comparePassword, hashPassword } from 'src/common/bcrypt';
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
import { ApiUserInfo, ApiUserItem } from 'types/capital/user';
import { IResponse } from 'types/common';
import { useCustomConfig } from 'src/config';
import { logger } from 'src/common/journal';

const customConfig = useCustomConfig();
const { capitalDatabaseName, imagePrefixUrl } = customConfig;

@Injectable()
export class UserService {
  private USERNAME_LENGTH_MAX = 10;
  private USERNAME_LENGTH_MIN = 3;
  constructor(
    @InjectModel(User.name, capitalDatabaseName) private readonly userModel: Model<User>,
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
            throw `账号长度应为${this.USERNAME_LENGTH_MIN}-${this.USERNAME_LENGTH_MAX}`;
          if (!/^[a-z][a-z_`~@*|()+-]{3,40}$/.test(username)) {
            throw '账号不符合规定';
          }
          return body;
        })
        // 判断用户名是否已存在
        .then(async (body) => {
          const { username } = body;
          const user = await this.userModel.findOne({ username });
          if (user) throw '用户名已注册';
          return body;
        })
        // 判断头像是否合理
        .then(async (body) => {
          const { avatar } = body;
          const hasHttpOrHttps = imageIsHasHttpOrHttps(avatar);
          if (hasHttpOrHttps) throw '头像保存的不合理，请处理之后再上传！';
          return body;
        })
        // 注册用户
        .then(async (body) => {
          const password = await hashPassword(body.password);
          const result = await this.userModel.create({
            ...body,
            password,
          });
          return {
            code: ApiCode.SUCCESS,
            result: result._id,
            message: '用户创建成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`创建用户 失败！ ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '创建用户失败！',
          };
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
          logger.error(`运用username查找用户 失败！ ${err}`);
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
          if (hasHttpOrHttps) throw '头像保存的不合理，请处理之后再上传！';
          return avatar;
        })
        // 判断username 是否为合法字符
        .then(async (avatar) => {
          return await this.userModel.findOne({ avatar });
        })
        // 返回错误
        .catch((err) => {
          logger.error(`运用avatar查找用户 失败！ ${err}`);
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
          const user = await this.userModel.findOne({ _id: userId }).lean();
          const routeFind = await this.roleService.findOneByRoleCode(user.roleCode);
          if (!routeFind) {
            throw {
              code: ApiCode.ERROR,
              message: '查询角色失败',
            };
          }
          const result: ApiUserInfo = {
            userId: user._id,
            roleCode: user.roleCode,
            roleName: routeFind.name,
            loginDate: nowDateFun(user.loginDate),
            username: user.username,
            avatar: `${imagePrefixUrl}${user.avatar}`,
            nickname: user.nickname,
          };
          return {
            code: ApiCode.SUCCESS,
            result,
            message: '查询成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`运用_id查找用户信息 失败！ ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '查询失败！',
          };
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
          const findData: FilterQuery<User> = {};
          if (nickname) findData.nickname = { $regex: nickname };
          if (username) findData.username = { $regex: username };
          const total = await this.userModel.find(findData).count();
          const findArr = await this.userModel.find(findData).limit(limit).skip(skip);
          const list: ApiUserItem[] = findArr.map((m) => ({
            userId: m.id,
            roleCode: m.roleCode,
            loginDate: nowDateFun(m.loginDate),
            username: m.username,
            avatar: `${imagePrefixUrl}${m.avatar}`,
            nickname: m.nickname,
          }));
          return {
            code: ApiCode.SUCCESS,
            result: { current, list, size, total },
            message: '查询成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`条件并分页获取用户列表 失败！ ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '查询失败！',
          };
        })
    );
  }

  /**
   * @description: 修改用户权限
   * @param {string} userId
   * @param {string} roleCode
   * @return {Promise<IResponse>}
   */
  public updateUserRole(userId: string, roleCode: string): Promise<IResponse> {
    return (
      Promise.resolve({ userId, roleCode })
        .then(async ({ userId, roleCode }) => {
          await this.userModel.updateOne({ _id: userId }, { roleCode });
          return {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`修改用户权限 失败！ ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '修改失败！',
          };
        })
    );
  }

  /**
   * @description: 修改用户基本信息
   * @param {string} userId
   * @param {UpdateUserInfoDto} updateUserInfoDto
   * @return {Promise<IResponse>}
   */
  public updateUserInfo(userId: string, updateUserInfoDto: UpdateUserInfoDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body: updateUserInfoDto })
        // 判断头像是否合理
        .then(async ({ userId, body }) => {
          const { avatar } = body;
          const hasHttpOrHttps = imageIsHasHttpOrHttps(avatar);
          if (hasHttpOrHttps) throw '头像保存的不合理，请处理之后再上传！';
          return { userId, body };
        })
        // 修改用户基本信息
        .then(async ({ userId, body }) => {
          await this.userModel.updateOne({ _id: userId }, body);
          return {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`修改用户基本信息 失败！ ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '修改失败！',
          };
        })
    );
  }

  /**
   * @description: 更新用户密码
   * @param {User} user
   * @param {UpdateUserPasswordDto} updateUserPasswordDto
   * @return {Promise<IResponse>}
   */
  public updateUserPassword(user: User, updateUserPasswordDto: UpdateUserPasswordDto): Promise<IResponse> {
    return (
      Promise.resolve({ user, body: updateUserPasswordDto })
        // 判断密码是否正确
        .then(async ({ user, body }) => {
          const verify = await comparePassword(body.password, user.password);
          if (!verify) {
            throw '密码错误';
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
          return {
            code: ApiCode.SUCCESS,
            message: '修改密码成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`更新用户密码 失败！ ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '修改密码失败！',
          };
        })
    );
  }

  /**
   * @description: 删除用户
   * @param {string} userId
   * @return {Promise<IResponse>}
   */
  public remove(userId: string): Promise<IResponse> {
    return (
      Promise.resolve(userId)
        .then(async (userId) => {
          await this.userModel.deleteOne({ _id: userId });
          return {
            code: ApiCode.SUCCESS,
            message: '删除成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`删除用户 失败！ ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '删除失败！',
          };
        })
    );
  }

  /**
   * @description: 修改登录时间
   * @param {string} userId
   * @return {Promise<User>}
   */
  public updateLoginDate(userId: string): Promise<User> {
    return (
      Promise.resolve(userId)
        .then(async (userId) => {
          const loginDate = new Date();
          return this.userModel.updateOne({ _id: userId }, { loginDate });
        })
        // 返回错误
        .catch((err) => {
          logger.error(`修改登录时间 失败！ ${err}`);
          return err;
        })
    );
  }

  /**
   * @description: 校验 token
   * @param {string} token
   * @return {Promise<string>}
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
        .catch((err) => {
          logger.error(`校验 token 失败！ ${err}`);
          return '';
        })
    );
  }

  /**
   * @description: 根据用户ID校验用户
   * @param {string} userId
   * @return {Promise<User | false>}
   */
  async validateUserByUserId(userId: string): Promise<User | false> {
    return (
      Promise.resolve(userId)
        .then(async (userId) => {
          return await this.userModel.findOne({ _id: userId });
        })
        // 返回错误
        .catch((err) => {
          logger.error(`根据用户ID校验用户 失败！ ${err}`);
          return false;
        })
    );
  }

  /**
   * @description: 获取用户数据库信息
   * @return {Promise<User>}
   */
  public findAllToData(): Promise<User> {
    return (
      Promise.resolve()
        // 分页查询
        .then(async () => {
          const list = await this.userModel.find();
          return list;
        })
        // 返回错误
        .catch((err) => {
          logger.error(`获取用户数据库信息 失败！ ${err}`);
          return err;
        })
    );
  }
}
