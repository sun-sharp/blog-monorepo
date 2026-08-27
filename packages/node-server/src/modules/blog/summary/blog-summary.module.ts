import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { useCustomConfig } from 'src/config';
import { RoleModule } from 'src/modules/capital/role/role.module';
import { UserModule } from 'src/modules/capital/user/user.module';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { User, UserSchema } from 'src/schemas/capital/user.schema';
import { Role, RoleSchema } from 'src/schemas/capital/role.schema';
import { Menu, MenuSchema } from 'src/schemas/capital/menu.schema';
import { Image, ImageSchema } from 'src/schemas/capital/image.schema';
import { Uric, UricSchema } from 'src/schemas/capital/uric.schema';
import { Article, ArticleSchema } from 'src/schemas/blog/article.schema';
import { Bank, BankSchema } from 'src/schemas/blog/money/bank.schema';
import { WeChat, WeChatSchema } from 'src/schemas/blog/money/we-chat.schema';
import { AliPay, AliPaySchema } from 'src/schemas/blog/money/ali-pay.schema';
import { BillUpload, BillUploadSchema } from 'src/schemas/blog/money/bill-upload.schema';
import { BlogSummaryController } from './blog-summary.controller';
import { BlogSummaryService } from './blog-summary.service';

const customConfig = useCustomConfig();
const { blogDatabaseName, capitalDatabaseName } = customConfig;

const CAPITAL_MONGO_MODULE = MongooseModule.forFeature(
  [
    { name: User.name, schema: UserSchema },
    { name: Role.name, schema: RoleSchema },
    { name: Menu.name, schema: MenuSchema },
    { name: Image.name, schema: ImageSchema },
    { name: Uric.name, schema: UricSchema },
  ],
  capitalDatabaseName,
);

const BLOG_MONGO_MODULE = MongooseModule.forFeature(
  [
    { name: Article.name, schema: ArticleSchema },
    { name: Bank.name, schema: BankSchema },
    { name: WeChat.name, schema: WeChatSchema },
    { name: AliPay.name, schema: AliPaySchema },
    { name: BillUpload.name, schema: BillUploadSchema },
  ],
  blogDatabaseName,
);

@Module({
  imports: [CAPITAL_MONGO_MODULE, BLOG_MONGO_MODULE, UserModule, RoleModule, JwtAuthModule],
  controllers: [BlogSummaryController],
  providers: [BlogSummaryService, JwtStrategy],
  exports: [BlogSummaryService],
})
export class BlogSummaryModule {}
