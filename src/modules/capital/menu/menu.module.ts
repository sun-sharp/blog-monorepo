import { forwardRef, Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from 'src/schemas/capital/menu.schema';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';

const MENU_MONGO_MODULE = MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }], 'capital');

@Module({
  imports: [MENU_MONGO_MODULE, UserModule, forwardRef(() => RoleModule)],
  controllers: [MenuController],
  providers: [MenuService, JwtStrategy],
  exports: [MenuService],
})
export class MenuModule {}
