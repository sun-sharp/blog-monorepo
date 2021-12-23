import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RouterModule } from '@nestjs/core';
import { CapitalController } from './capital.controller';
import { CapitalService } from './capital.service';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JWT_CONSTANTS } from 'src/jwt/jwt.constants';
import { JwtModule } from '@nestjs/jwt';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://yrr:AlyYrrAdmin123@120.79.162.189:5606/capital?authSource=admin'),
    PassportModule,
    JwtModule.register({
      secret: JWT_CONSTANTS.secret,
    }),
    UserModule,
    RoleModule,
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
        ],
      },
    ]),
  ],
  controllers: [CapitalController],
  providers: [CapitalService],
})
export class CapitalModule {}
