import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RouterModule } from '@nestjs/core';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JWT_CONSTANTS } from 'src/jwt/jwt.constants';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://yrr:AlyYrrAdmin123@120.79.162.189:5606/blog?authSource=admin'),
    PassportModule,
    JwtModule.register({
      secret: JWT_CONSTANTS.secret,
    }),
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
  controllers: [BlogController],
  providers: [BlogService],
  // exports: [BLOG_MONGO_MODULE],
})
export class BlogModule {}
