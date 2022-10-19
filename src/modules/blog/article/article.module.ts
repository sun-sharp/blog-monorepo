import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from 'src/schemas/blog/article.schema';
import { JwtStrategy } from 'src/jwt/jwt.strategy';

const ARTICLE_MONGO_MODULE = MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }], 'blog');

@Module({
  imports: [ARTICLE_MONGO_MODULE],
  controllers: [ArticleController],
  providers: [ArticleService, JwtStrategy],
  exports: [ArticleService],
})
export class ArticleModule {}
