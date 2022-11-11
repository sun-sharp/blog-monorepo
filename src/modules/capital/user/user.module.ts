import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/capital/user.schema';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONSTANTS } from 'src/jwt/jwt.constants';

const USER_MONGO_MODULE = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }], 'capital');

@Module({
  imports: [
    USER_MONGO_MODULE,
    JwtModule.register({
      secret: JWT_CONSTANTS.secret,
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
