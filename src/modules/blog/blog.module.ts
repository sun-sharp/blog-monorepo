import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { RouterModule } from '@nestjs/core';
import { ArticleModule } from './article/article.module';
import { blogMongooseModuleForRoot } from 'src/common/constant/mongoose';
import { MoneyModule } from './money/money.module';
import { WeChatModule } from './money/we-chat/we-chat.module';
import { AliPayModule } from './money/ali-pay/ali-pay.module';
import { BankModule } from './money/bank/bank.module';
import { BillUploadModule } from './money/bill-upload/bill-upload.module';

@Module({
  imports: [
    blogMongooseModuleForRoot,
    ArticleModule,
    MoneyModule,
    RouterModule.register([
      {
        path: 'blog',
        children: [
          {
            path: '/',
            module: ArticleModule,
          },
          {
            path: '/',
            module: MoneyModule,
          },
          {
            path: '/money',
            children: [
              {
                path: '/',
                module: WeChatModule,
              },
              {
                path: '/',
                module: AliPayModule,
              },
              {
                path: '/',
                module: BankModule,
              },
              {
                path: '/',
                module: BillUploadModule,
              },
            ],
          },
        ],
      },
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
