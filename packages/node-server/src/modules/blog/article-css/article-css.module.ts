import { forwardRef, Module } from '@nestjs/common';
import { ArticleCssService } from './article-css.service';
import { ArticleCssController } from './article-css.controller';
import { JwtStrategy } from '@/jwt/jwt.strategy';
import { useCustomConfig } from '@/config';
import { ArticleCss, ArticleCssSchema } from '@/schemas/blog/article-css.schema';
import { UserModule } from '@/modules/capital/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from '@/modules/capital/role/role.module';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

const ARTICLE_CSS_MONGO_MODULE = MongooseModule.forFeature([{ name: ArticleCss.name, schema: ArticleCssSchema }], blogDatabaseName);

@Module({
  imports: [ARTICLE_CSS_MONGO_MODULE, UserModule, forwardRef(() => RoleModule)],
  controllers: [ArticleCssController],
  providers: [ArticleCssService, JwtStrategy],
  exports: [ArticleCssService],
})
export class ArticleCssModule {}
