import { JwtModule } from '@nestjs/jwt';

// jwt 令牌
export const JWT_SECRET = 'secretKey';

// jwt 过期时间("60s", "2 days", "10h", "7d" )
export const JWT_EXPIRES_IN = '30s';

// jwt的module处理
export const JwtModuleRegister = JwtModule.register({
  secret: JWT_SECRET,
  signOptions: { expiresIn: JWT_EXPIRES_IN },
});
