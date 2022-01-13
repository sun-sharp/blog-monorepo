import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from 'src/schemas/menu.schema';

const MENU_MONGO_MODULE = MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]);

@Module({
  imports: [MENU_MONGO_MODULE],
  controllers: [MenuController],
  providers: [MenuService, JwtStrategy],
  exports: [MenuService],
})
export class MenuModule {}
