import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://yrr:AlyYrrAdmin123@120.79.162.189:5606/blog?authSource=admin',
    ),
    UserModule,
  ],
})
export class BlogModule {}
