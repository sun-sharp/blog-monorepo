import { forwardRef, Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from 'src/schemas/blog/article.schema';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { UserModule } from 'src/modules/capital/user/user.module';
import { RoleModule } from 'src/modules/capital/role/role.module';
import { useCustomConfig } from 'src/config';
import { ArticleCssModule } from '../article-css/article-css.module';
import { ArticlePolicyModule } from '../article-policy/article-policy.module';
import { ArticlePreviewModule } from '../article-preview/article-preview.module';

const customConfig = useCustomConfig();

const { blogDatabaseName } = customConfig;

const ARTICLE_MONGO_MODULE = MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }], blogDatabaseName);

@Module({
  imports: [ARTICLE_MONGO_MODULE, UserModule, forwardRef(() => RoleModule), ArticleCssModule, ArticlePreviewModule, ArticlePolicyModule],
  controllers: [ArticleController],
  providers: [ArticleService, JwtStrategy],
  exports: [ArticleService],
})
export class ArticleModule {}
