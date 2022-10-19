import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RouterModule } from '@nestjs/core';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://yrr:AlyYrrAdmin123@120.79.162.189:5606/money?authSource=admin', {
      connectionName: 'blog',
    }),
    ArticleModule,
    RouterModule.register([
      {
        path: 'blog',
        children: [
          {
            path: '/',
            module: ArticleModule,
          },
        ],
      },
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
