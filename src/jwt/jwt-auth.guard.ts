import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/modules/capital/user/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly userService: UserService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    // const res = context.switchToHttp().getResponse();
    // console.log(req, 'req');
    // console.log(res, 'res');

    return (
      Promise.resolve({ req })
        .then(async ({ req }) => {
          const accessToken = req.get('Authorization');
          if (!accessToken) throw '请先登录';
          const atUserId = await this.userService.verifyToken(accessToken);
          if (!atUserId) throw '当前登录已过期，请重新登录';
          const user = await this.userService.validateUserByUserId(atUserId);
          if (!user) throw '用户不存在';
          // 将当前请求交给下一级
          return this.activate(context);
        })
        // 返回错误
        .catch((err) => {
          throw new UnauthorizedException(err);
        })
    );
    // try {
    //   const accessToken = req.get('Authorization');
    //   if (!accessToken) throw new UnauthorizedException('请先登录');

    //   const atUserId = this.userService.verifyToken(accessToken);
    //   if (atUserId) return this.activate(context);
    //   console.log(req.user);
    //   const refreshToken = req.get('RefreshToken');
    //   const rtUserId = this.userService.verifyToken(refreshToken);
    //   if (!rtUserId) throw new UnauthorizedException('当前登录已过期，请重新登录');
    //   const user = await this.userService.findById(rtUserId);
    //   if (user) {
    //     const tokens = this.userService.genToken({ id: rtUserId });
    //     // request headers 对象 prop 属性全自动转成小写，
    //     // 所以 获取 request.headers['authorization'] 或 request.get('Authorization')
    //     // 重置属性 request.headers[authorization] = value
    //     req.headers['authorization'] = tokens.accessToken;
    //     req.headers['refreshtoken'] = tokens.refreshToken;
    //     // 在响应头中加入新的token，客户端判断响应头有无 Authorization 字段，有则重置
    //     res.header('Authorization', tokens.accessToken);
    //     res.header('RefreshToken', tokens.refreshToken);
    //     // 将当前请求交给下一级
    //     return this.activate(context);
    //   } else {
    //     throw new UnauthorizedException('用户不存在');
    //   }
    // } catch (error) {
    //   // Logger
    //   return false;
    // }
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }
}
