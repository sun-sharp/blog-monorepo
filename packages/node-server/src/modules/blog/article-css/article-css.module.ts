import { forwardRef, Module } from '@nestjs/common';
import { ArticleCssService } from './article-css.service';
import { ArticleCssController } from './article-css.controller';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { useCustomConfig } from 'src/config';
import { ArticleCss, ArticleCssSchema } from 'src/schemas/blog/article-css.schema';
import { UserModule } from 'src/modules/capital/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/modules/capital/role/role.module';

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
