import { forwardRef, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/schemas/capital/role.schema';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { UserModule } from '../user/user.module';
import { useCustomConfig } from 'src/config';

const customConfig = useCustomConfig();

const { capitalDatabaseName } = customConfig;

const ROLE_MONGO_MODULE = MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }], capitalDatabaseName);

@Module({
  imports: [ROLE_MONGO_MODULE, forwardRef(() => UserModule)],
  controllers: [RoleController],
  providers: [RoleService, JwtStrategy],
  exports: [RoleService],
})
export class RoleModule {}
