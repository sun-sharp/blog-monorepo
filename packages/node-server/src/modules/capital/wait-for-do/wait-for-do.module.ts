import { Module, forwardRef } from '@nestjs/common';
import { WaitForDoService } from './wait-for-do.service';
import { WaitForDoController } from './wait-for-do.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WaitForDo, WaitForDoSchema } from 'src/schemas/capital/wait-for-do.schema';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { useCustomConfig } from 'src/config';

const customConfig = useCustomConfig();

const { capitalDatabaseName } = customConfig;

const WAIT_FOR_DO_MONGO_MODULE = MongooseModule.forFeature([{ name: WaitForDo.name, schema: WaitForDoSchema }], capitalDatabaseName);

@Module({
  imports: [WAIT_FOR_DO_MONGO_MODULE, UserModule, forwardRef(() => RoleModule)],
  controllers: [WaitForDoController],
  providers: [WaitForDoService, JwtStrategy],
  exports: [WaitForDoService],
})
export class WaitForDoModule {}
