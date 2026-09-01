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
import { ManualBillModule } from './money/manual-bill/manual-bill.module';
import { BankCardModule } from './money/bank-card/bank-card.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ArticleCssModule } from './article-css/article-css.module';
import { ArticlePolicyModule } from './article-policy/article-policy.module';
import { ArticlePreviewModule } from './article-preview/article-preview.module';
import { BlogSummaryModule } from './summary/blog-summary.module';

@Module({
  imports: [
    blogMongooseModuleForRoot,
    ArticleModule,
    MoneyModule,
    ScheduleModule,
    ArticleCssModule,
    ArticlePolicyModule,
    ArticlePreviewModule,
    BlogSummaryModule,
    RouterModule.register([
      {
        path: 'blog',
        children: [
          {
            path: '/',
            module: ScheduleModule,
          },
          {
            path: '/',
            module: ArticleModule,
          },
          {
            path: '/',
            module: MoneyModule,
          },
          {
            path: '/',
            module: ArticleCssModule,
          },
          {
            path: '/',
            module: ArticlePolicyModule,
          },
          {
            path: '/',
            module: BlogSummaryModule,
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
              {
                path: '/',
                module: ManualBillModule,
              },
              {
                path: '/',
                module: BankCardModule,
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
