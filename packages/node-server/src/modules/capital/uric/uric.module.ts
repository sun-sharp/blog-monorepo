import { forwardRef, Module } from '@nestjs/common';
import { UricService } from './uric.service';
import { UricController } from './uric.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { useCustomConfig } from 'src/config';
import { Uric, UricSchema } from 'src/schemas/capital/uric.schema';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { JwtStrategy } from 'src/jwt/jwt.strategy';

const customConfig = useCustomConfig();

const { capitalDatabaseName } = customConfig;

const URIC_MONGO_MODULE = MongooseModule.forFeature([{ name: Uric.name, schema: UricSchema }], capitalDatabaseName);

@Module({
  imports: [URIC_MONGO_MODULE, UserModule, forwardRef(() => RoleModule)],
  controllers: [UricController],
  providers: [UricService, JwtStrategy],
  exports: [UricService],
})
export class UricModule {}
