import { forwardRef, Module } from '@nestjs/common';
import { ArticlePolicyService } from './article-policy.service';
import { ArticlePolicyController } from './article-policy.controller';
import { useCustomConfig } from 'src/config';
import { UserModule } from 'src/modules/capital/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/modules/capital/role/role.module';
import { ArticlePolicy, ArticlePolicySchema } from 'src/schemas/blog/article-policy.schema';
import { JwtStrategy } from 'src/jwt/jwt.strategy';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

const ARTICLE_POLICY_MONGO_MODULE = MongooseModule.forFeature([{ name: ArticlePolicy.name, schema: ArticlePolicySchema }], blogDatabaseName);

@Module({
  imports: [ARTICLE_POLICY_MONGO_MODULE, UserModule, forwardRef(() => RoleModule)],
  controllers: [ArticlePolicyController],
  providers: [ArticlePolicyService, JwtStrategy],
  exports: [ArticlePolicyService],
})
export class ArticlePolicyModule {}
