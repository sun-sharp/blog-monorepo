import { ExecutionContext, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleService } from 'src/modules/capital/role/role.service';
import { UserService } from 'src/modules/capital/user/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    return (
      Promise.resolve({ req })
        .then(async ({ req }) => {
          const accessToken = req.get('Authorization');
          if (!accessToken) throw '请先登录';
          const atUserId = await this.userService.verifyToken(accessToken);
          if (!atUserId) throw '当前登录已过期，请重新登录';
          const user = await this.userService.validateUserByUserId(atUserId);
          if (!user) throw '用户不存在';
          if (user.roleCode !== 'manager') {
            let method = '';
            const methods = req.route.methods;
            Object.keys(methods).forEach((key) => {
              if (methods[key]) {
                method = key;
              }
            });
            const validateRole = await this.roleService.validateRoleByRoleCode(user.roleCode, req.route.path, method);
            if (!validateRole) throw { message: '用户权限不足，请联系管理员', status: 403 };
          }
          // 将当前请求交给下一级
          return this.activate(context);
        })
        // 返回错误
        .catch((err) => {
          if (typeof err === 'string') {
            throw new UnauthorizedException(err);
          }
          throw new HttpException(err.message, err.status);
        })
    );
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }
}
