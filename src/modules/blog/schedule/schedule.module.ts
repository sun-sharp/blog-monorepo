import { forwardRef, Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Schedule, ScheduleSchema } from 'src/schemas/blog/schedule.schema';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { UserModule } from 'src/modules/capital/user/user.module';
import { RoleModule } from 'src/modules/capital/role/role.module';
import { useCustomConfig } from 'src/config';

const customConfig = useCustomConfig();

const { blogDatabaseName } = customConfig;

const SCHEDULE_MONGO_MODULE = MongooseModule.forFeature([{ name: Schedule.name, schema: ScheduleSchema }], blogDatabaseName);

@Module({
  imports: [SCHEDULE_MONGO_MODULE, UserModule, forwardRef(() => RoleModule)],
  controllers: [ScheduleController],
  providers: [ScheduleService, JwtStrategy],
  exports: [ScheduleService],
})
export class ScheduleModule {}
