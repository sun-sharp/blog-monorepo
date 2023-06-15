import { forwardRef, Module } from '@nestjs/common';
import { ArticleCategoryService } from './article-category.service';
import { ArticleCategoryController } from './article-category.controller';
import { ArticleCategory, ArticleCategorySchema } from 'src/schemas/blog/article-category.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { UserModule } from 'src/modules/capital/user/user.module';
import { RoleModule } from 'src/modules/capital/role/role.module';

const ARTICLE_CATEGORY_MONGO_MODULE = MongooseModule.forFeature([{ name: ArticleCategory.name, schema: ArticleCategorySchema }], 'blog');

@Module({
  imports: [ARTICLE_CATEGORY_MONGO_MODULE, UserModule, forwardRef(() => RoleModule)],
  controllers: [ArticleCategoryController],
  providers: [ArticleCategoryService, JwtStrategy],
  exports: [ArticleCategoryService],
})
export class ArticleCategoryModule {}
