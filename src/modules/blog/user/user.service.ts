import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/common/bcrypt';
import { IResponse } from 'src/interfaces/response.interface';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { PageUserDto } from './dto/page-user.dto';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';

@Injectable()
export class UserService {
  private USERNAME_LENGTH_MAX = 10;
  private USERNAME_LENGTH_MIN = 3;
  response: IResponse;
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  /**
   * @description 创建用户
   * @date 22/11/2021
   * @param {CreateUserDto} createUserDto
   * @return {*} {Promise<IResponse>}
   * @memberof UserService
   */
  public create(createUserDto: CreateUserDto): Promise<IResponse> {
    return (
      Promise.resolve(createUserDto)
        // 判断username 是否为合法字符
        .then((res) => {
          const { username } = res;
          // if (!username.match(/^[a-z]/i)) throw '首字母应为字母';
          if (username.length > this.USERNAME_LENGTH_MAX || username.length < this.USERNAME_LENGTH_MIN)
            throw (this.response = {
              code: ApiCode.ERROR,
              massage: `长度应为${this.USERNAME_LENGTH_MIN}-${this.USERNAME_LENGTH_MAX}`,
            });
          if (!username.match(/[a-z]$/i)) {
            throw (this.response = {
              code: ApiCode.ERROR,
              massage: '应全为字母',
            });
          }
          return res;
        })
        // 判断用户名是否已存在
        .then(async (res) => {
          const { username } = res;
          const user = await this.userModel.findOne({ username });
          if (user)
            throw (this.response = {
              code: ApiCode.ERROR,
              massage: '用户名已注册',
            });
          return res;
        })
        // 注册用户
        .then(async (res) => {
          const password = await hashPassword(res.password);
          await this.userModel.create({
            ...res,
            password,
          });
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: true,
            massage: '用户创建成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }

  /**
   * @description 运用username查找用户
   * @date 25/11/2021
   * @param {string} username
   * @return {*}  {Promise<User>}
   * @memberof UserService
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
   * @description 运用_id查找用户信息
   * @date 25/11/2021
   * @param {string} username
   * @return {*}  {Promise<User>}
   * @memberof UserService
   */
  public findOneById(userId: string): Promise<User> {
    return (
      Promise.resolve(userId)
        // 判断username 是否为合法字符
        .then(async (userId) => {
          const user = await this.userModel.findOne({ _id: userId });
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: {
              id: user._id,
              roleCode: user.roleCode,
              loginDate: user.loginDate,
              username: user.username,
              avatar: user.avatar,
              name: user.name,
            },
            massage: '查询成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }

  /**
   * @description 分页查询
   * @date 25/11/2021
   * @return {*}  {Promise<User>}
   * @memberof UserService
   */
  public findPage(pageUserDto: PageUserDto): Promise<User> {
    return (
      Promise.resolve(pageUserDto)
        // 分页查询
        .then(async (pageUserDto) => {
          const { size, current, name, username } = pageUserDto;
          const { limit, skip } = PaginateHandle(size, current);
          const findData = { name: { $regex: name }, username: { $regex: username } };
          const total = await this.userModel.find(findData).count();
          const list = await this.userModel.find(findData).limit(limit).skip(skip);
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: {
              current,
              list: list.map((m) => ({
                id: m._id,
                roleCode: m.roleCode,
                loginDate: m.loginDate,
                username: m.username,
                avatar: m.avatar,
                name: m.name,
              })),
              size,
              total,
            },
            massage: '查询成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
