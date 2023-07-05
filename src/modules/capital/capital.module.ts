import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CapitalController } from './capital.controller';
import { CapitalService } from './capital.service';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModuleRegister } from 'src/jwt/jwt.constants';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';
import { capitalMongooseModuleForRoot } from 'src/common/constant/mongoose';
import { ConfigurationModule } from './configuration/configuration.module';
import { CategoryModule } from './category/category.module';
import { ImageModule } from './image/image.module';
import { WaitForDoModule } from './wait-for-do/wait-for-do.module';

@Module({
  imports: [
    capitalMongooseModuleForRoot,
    PassportModule,
    JwtModuleRegister,
    UserModule,
    RoleModule,
    MenuModule,
    ConfigurationModule,
    CategoryModule,
    ImageModule,
    WaitForDoModule,
    RouterModule.register([
      {
        path: 'capital',
        children: [
          {
            path: '/',
            module: UserModule,
          },
          {
            path: '/',
            module: RoleModule,
          },
          {
            path: '/',
            module: MenuModule,
          },
          {
            path: '/',
            module: ConfigurationModule,
          },
          {
            path: '/',
            module: CategoryModule,
          },
          {
            path: '/',
            module: ImageModule,
          },
          {
            path: '/',
            module: WaitForDoModule,
          },
        ],
      },
    ]),
  ],
  controllers: [CapitalController],
  providers: [CapitalService],
})
export class CapitalModule {}
