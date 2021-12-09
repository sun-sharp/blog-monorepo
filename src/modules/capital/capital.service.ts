import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IResponse } from 'src/interfaces/response.interface';
import { comparePassword } from 'src/common/bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user/user.service';
import { ApiCode } from 'src/common/enums/api-code.enum';

@Injectable()
export class CapitalService {
  response: IResponse;
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  /**
   * @description 登录
   * @date 22/11/2021
   * @param {LoginUserDto} loginUserDto
   * @return {*}  {Promise<IResponse>}
   * @memberof UserService
   */
  public login(loginUserDto: LoginUserDto): Promise<IResponse> {
    return (
      Promise.resolve(loginUserDto)
        // 判断用户名是否存在,密码是否正确
        .then(async (res) => {
          const { username } = res;
          const user = await this.userService.findOneByName(username);
          if (!user)
            throw (this.response = {
              code: ApiCode.ERROR,
              massage: '用户尚未注册',
            });
          if (await comparePassword(res.password, user.password)) {
            return {
              _id: user._id,
            };
          } else {
            throw (this.response = {
              code: ApiCode.ERROR,
              massage: '密码错误',
            });
          }
        })
        // 创造token
        .then((res) => {
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: {
              token: this.jwtService.sign(res),
            },
            massage: '请求成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }
}
