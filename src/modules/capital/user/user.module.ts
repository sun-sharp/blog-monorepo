import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/capital/user.schema';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { RoleModule } from '../role/role.module';
import { JwtModuleRegister } from 'src/jwt/jwt.constants';
import { useCustomConfig } from 'src/config';

const customConfig = useCustomConfig();

const { capitalDatabaseName } = customConfig;

const USER_MONGO_MODULE = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }], capitalDatabaseName);

@Module({
  imports: [USER_MONGO_MODULE, JwtModuleRegister, forwardRef(() => RoleModule)],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
