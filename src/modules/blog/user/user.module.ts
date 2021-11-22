import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/interfaces/user.interface';
import { UserSchema } from 'src/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONSTANTS } from './jwt.constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

const USER_MONGO_MODULE = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]);

@Module({
  imports: [
    USER_MONGO_MODULE,
    PassportModule,
    JwtModule.register({
      secret: JWT_CONSTANTS.secret,
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  // exports: [USER_MONGO_MODULE],
})
export class UserModule {}
