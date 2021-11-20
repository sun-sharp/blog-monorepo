import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RouterModule } from '@nestjs/core';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://yrr:AlyYrrAdmin123@120.79.162.189:5606/blog?authSource=admin',
    ),
    UserModule,
    RouterModule.register([
      {
        path: 'blog',
        children: [
          {
            path: '/',
            module: UserModule,
          },
        ],
      },
    ]),
  ],
})
export class BlogModule {}
