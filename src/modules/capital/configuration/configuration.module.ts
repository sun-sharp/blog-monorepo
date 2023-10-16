import { forwardRef, Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';
import { Configuration, ConfigurationSchema } from 'src/schemas/capital/configuration.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from '../role/role.module';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { UserModule } from '../user/user.module';
import { useCustomConfig } from 'src/config';

const customConfig = useCustomConfig();

const { capitalDatabaseName } = customConfig;

const CONFIGURATION_MONGO_MODULE = MongooseModule.forFeature([{ name: Configuration.name, schema: ConfigurationSchema }], capitalDatabaseName);

@Module({
  imports: [CONFIGURATION_MONGO_MODULE, UserModule, forwardRef(() => RoleModule)],
  controllers: [ConfigurationController],
  providers: [ConfigurationService, JwtStrategy],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
