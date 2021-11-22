import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { IResponse } from 'src/interfaces/response.interface';
import { User } from 'src/interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private USERNAME_LENGTH_MAX = 10;
  private USERNAME_LENGTH_MIN = 3;
  constructor(@InjectModel('User') private readonly userModel: Model<User>, private readonly jwtService: JwtService) {}

  /**
   * @description 验证密码
   * @date 22/11/2021
   * @private
   * @param {string} password
   * @param {string} hashPassword
   * @return {*}  {Promise<boolean>}
   * @memberof UserService
   */
  private async comparePassword(password: string, hashPassword: string): Promise<boolean> {
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
  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  /**
   * @description 创建用户
   * @date 22/11/2021
   * @param {CreateUserDto} createUserDto
   * @return {*}
   * @memberof UserService
   */
  public create(createUserDto: CreateUserDto): Promise<string> {
    return (
      Promise.resolve(createUserDto)
        // 判断username 是否为合法字符
        .then((res) => {
          const { username } = res;
          // if (!username.match(/^[a-z]/i)) throw '首字母应为字母';
          if (username.length > this.USERNAME_LENGTH_MAX || username.length < this.USERNAME_LENGTH_MIN)
            throw `长度应为${this.USERNAME_LENGTH_MIN}-${this.USERNAME_LENGTH_MAX}`;
          if (!username.match(/[a-z]$/i)) {
            throw '应全为字母';
          }
          return res;
        })
        // 判断用户名是否已存在
        .then(async (res) => {
          const { username } = res;
          const user = await this.userModel.findOne({ username });
          if (user) throw '用户名已注册';
          return res;
        })
        // 注册用户
        .then(async (res) => {
          const password = await this.hashPassword(res.password);
          await this.userModel.create({
            ...res,
            password,
          });
          return '用户创建成功！';
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }

  /**
   * @description 登录
   * @date 22/11/2021
   * @param {LoginUserDto} loginUserDto
   * @return {*}  {Promise<string>}
   * @memberof UserService
   */
  public login(loginUserDto: LoginUserDto): Promise<string> {
    return (
      Promise.resolve(loginUserDto)
        // 判断用户名是否存在,密码是否正确
        .then(async (res) => {
          const { username } = res;
          const user = await this.userModel.findOne({ username });
          if (!user) throw '用户尚未注册';
          if (await this.comparePassword(res.password, user.password)) {
            return {
              ...res,
              _id: user._id,
            };
          } else {
            throw '密码错误';
          }
        })
        // 创造token
        .then((res) => {
          return this.jwtService.sign(res);
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }

  public findPage() {
    return this.userModel.find();
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
