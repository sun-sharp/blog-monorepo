import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/schemas/capital/user.schema';
import { UserService } from 'src/modules/capital/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: User) {
    const user = await this.userService.validateUserByUserId(payload._id);
    // 如果有用户信息，代表 token 没有过期，没有则 token 已失效
    if (!user) throw new UnauthorizedException('用户权限不足，请联系管理员');
    return user;
  }
}
