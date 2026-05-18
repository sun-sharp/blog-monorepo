import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 获取请求对象
    const request = context.switchToHttp().getRequest();

    // 检查是否有Authorization头
    const authHeader = request.headers.authorization;

    // 如果没有Authorization头，则允许访问（不验证）
    if (!authHeader) {
      return true;
    }

    // 如果有Authorization头，则尝试进行JWT验证
    // 使用try-catch包装，防止验证失败时抛出异常
    try {
      return super.canActivate(context);
    } catch {
      // 如果JWT验证失败，仍然允许访问（作为未登录用户）
      return true;
    }
  }

  handleRequest(err: any, user: any) {
    // 对于可选认证，无论是否有错误或用户，都允许访问
    // 如果有错误或没有用户，返回null（表示未登录）
    if (err || !user) {
      return null;
    }
    return user;
  }
}
