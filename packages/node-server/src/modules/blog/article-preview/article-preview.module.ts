import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { useCustomConfig } from 'src/config';
import { ArticlePreview, ArticlePreviewSchema } from 'src/schemas/blog/article-preview.schema';
import { ArticlePreviewService } from './article-preview.service';
import { ArticleCssModule } from '../article-css/article-css.module';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

const ARTICLE_PREVIEW_MONGO_MODULE = MongooseModule.forFeature([{ name: ArticlePreview.name, schema: ArticlePreviewSchema }], blogDatabaseName);

@Module({
  imports: [ARTICLE_PREVIEW_MONGO_MODULE, ArticleCssModule],
  providers: [ArticlePreviewService],
  exports: [ArticlePreviewService],
})
export class ArticlePreviewModule {}