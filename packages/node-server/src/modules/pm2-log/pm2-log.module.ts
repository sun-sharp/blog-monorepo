import { Module } from '@nestjs/common';
import { Pm2LogController } from './pm2-log.controller';
import { Pm2LogService } from './pm2-log.service';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { RoleModule } from '../capital/role/role.module';
import { UserModule } from '../capital/user/user.module';

@Module({
  imports: [JwtAuthModule, UserModule, RoleModule],
  controllers: [Pm2LogController],
  providers: [Pm2LogService],
  exports: [Pm2LogService],
})
export class Pm2LogModule {}
