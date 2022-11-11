import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_CONSTANTS } from './jwt.constants';
import { User } from 'src/schemas/capital/user.schema';
import { UserService } from 'src/modules/capital/user/user.service';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTANTS.secret,
    });
  }

  async validate(payload: User) {
    const user = await this.userService.validateUserByUserId(payload._id);
    // 如果有用户信息，代表 token 没有过期，没有则 token 已失效
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
