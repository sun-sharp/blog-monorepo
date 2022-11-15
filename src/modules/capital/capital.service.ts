import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IResponse } from 'src/interfaces/response.interface';
import { comparePassword } from 'src/common/bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user/user.service';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { RoleService } from './role/role.service';
import { MenuService } from './menu/menu.service';
import { logger } from 'src/common/journal';

@Injectable()
export class CapitalService {
  response: IResponse;
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly menuService: MenuService,
    private readonly jwtService: JwtService,
  ) {}

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
          if (!user) {
            throw (this.response = {
              code: ApiCode.ERROR,
              message: '用户尚未注册',
            });
          }
          if (await comparePassword(res.password, user.password)) {
            return {
              _id: user._id,
              // nickname: user.nickname,
              // username: user.username,
            };
          } else {
            throw (this.response = {
              code: ApiCode.ERROR,
              message: '密码错误',
            });
          }
        })
        // 修改登录时间
        .then(async (res) => {
          await this.userService.updateLoginDate(res._id);
          logger.log(`修改登录时间`);
          return {
            _id: res._id,
            // nickname: res.nickname,
            // username: res.username,
          };
        })
        // 创造token
        .then((res) => {
          const token = this.jwtService.sign(res);
          logger.log(`创造token，请求成功！`, token);
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: {
              token,
            },
            message: '请求成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          logger.error(`返回错误`, err);
          return err;
        })
    );
  }

  /**
   * @description: 路由权限获取管理系统菜单列表
   * @param {string} roleCode
   * @return {*}
   */
  public roleMenu(roleCode: string): Promise<IResponse> {
    return (
      Promise.resolve(roleCode)
        // 判断用户名是否存在,密码是否正确
        .then(async (roleCode) => {
          const routeFind = await this.roleService.findOneByRoleCode(roleCode);
          if (!routeFind) {
            throw (this.response = {
              code: ApiCode.ERROR,
              message: '查询角色失败',
            });
          }
          // 如果你是管理员账号，那就获取全部菜单
          if (routeFind.roleType === 1) {
            const result = await this.menuService.findAll();
            if (result.code === ApiCode.SUCCESS) {
              return result;
            }
          }
          // 不是管理员账号，执行下面
          const routePermission = routeFind.permission;
          const result = await this.menuService.findByPermission(routePermission);
          if (result) {
            return (this.response = {
              code: ApiCode.SUCCESS,
              result: result.map((m) => ({
                menuId: m._id,
                name: m.name,
                title: m.title,
                sort: m.sort,
                icon: m.icon,
                parentId: m.parentId,
                iframeSrc: m.iframeSrc,
                component: m.component,
                menuType: m.menuType,
                hidden: m.hidden,
              })),
              message: '查询成功！',
            });
          }
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
}
