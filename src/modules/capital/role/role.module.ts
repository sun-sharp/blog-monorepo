import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/schemas/capital/role.schema';
import { JwtStrategy } from 'src/jwt/jwt.strategy';

const ROLE_MONGO_MODULE = MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }], 'capital');

@Module({
  imports: [ROLE_MONGO_MODULE],
  controllers: [RoleController],
  providers: [RoleService, JwtStrategy],
  exports: [RoleService],
})
export class RoleModule {}
