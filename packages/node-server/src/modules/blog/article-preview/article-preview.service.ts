import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { useCustomConfig } from 'src/config';
import { logger } from 'src/common/journal';
import { ArticlePreview } from 'src/schemas/blog/article-preview.schema';
import { markdownToHtml } from 'src/common/markdown';
import { ArticleCssService } from '../article-css/article-css.service';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

const DEFAULT_PREVIEW_EXPIRE_MS = 24 * 60 * 60 * 1000; // 默认 1 天过期

@Injectable()
export class ArticlePreviewService {
  private readonly log = new Logger(ArticlePreviewService.name);

  constructor(
    @InjectModel(ArticlePreview.name, blogDatabaseName)
    private readonly previewModel: Model<ArticlePreview>,
    private readonly articleCssService: ArticleCssService,
  ) {}

  /**
   * @description: 保存临时预览数据（未保存的文章）
   * @param {string} markdownContent
   * @param {string} cssName
   * @return {Promise<string | null>} 返回 previewId
   */
  public async saveTempPreview(markdownContent: string, cssName: string): Promise<string | null> {
    try {
      const expiresAt = new Date(Date.now() + DEFAULT_PREVIEW_EXPIRE_MS);
      const result = await this.previewModel.create({ markdownContent, cssName, expiresAt });
      return (result._id as unknown as string).toString();
    } catch (err) {
      logger.error(`保存临时预览 失败! ${JSON.stringify(err)}`);
      return null;
    }
  }

  /**
   * @description: 根据 previewId 查询临时预览数据
   * @param {string} previewId
   * @return {Promise<ArticlePreview | null>}
   */
  public async findById(previewId: string): Promise<ArticlePreview | null> {
    try {
      const preview = await this.previewModel.findById(previewId).lean().exec();
      if (!preview) return null;
      // 过期则视为无效
      if (preview.expiresAt && new Date() > new Date(preview.expiresAt)) {
        return null;
      }
      return preview;
    } catch (err) {
      logger.error(`查询临时预览 失败! ${JSON.stringify(err)}`);
      return null;
    }
  }

  /**
   * @description: 由 markdown 生成 html 并拼接完整渲染文档（两个渲染接口公共部分）
   * @param {string} markdownContent md 原文
   * @param {string} cssName 样式名
   * @param {string} title 页面标题
   * @return {Promise<string>} 完整 HTML 字符串
   */
  public async buildRenderHtml(markdownContent: string, cssName: string, title: string): Promise<string> {
    const [previewHtml, cssContent] = await Promise.all([
      markdownToHtml(markdownContent),
      this.articleCssService.findOneByName(cssName),
    ]);
    return this.wrapRenderHtml(previewHtml, cssContent, cssName, title || '文章');
  }

  /**
   * @description: 拼接完整渲染文档（接收已转换的 html）
   * @param {string} htmlContent
   * @param {string} cssContent
   * @param {string} cssName
   * @param {string} title
   * @return {string}
   */
  public wrapRenderHtml(htmlContent: string, cssContent: string, cssName: string, title: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${cssContent}</style>
  <style>
    body {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    /* 防止整体横向滚动 */
    html, body {
      overflow-x: hidden;
      max-width: 100%;
      box-sizing: border-box;
    }
    img {
      max-width: 100% !important;
      height: auto !important;
    }
    table {
      display: block;
      width: 100%;
      overflow-x: auto;
      max-width: 100%;
    }
    pre, code {
      overflow-x: auto;
      max-width: 100%;
      white-space: pre;
      word-break: normal;
    }
    /* 可加其他自定义样式 */
  </style>
</head>
<body>
  <div id="preview-only" class="md-editor md-edit-preview__cont md-editor-previewOnly">
  <div id="preview-only-preview-wrapper" class="md-editor-preview-wrapper">
  <div id="preview-only-preview" class="md-editor-preview ${cssName}-theme md-editor-scrn">${htmlContent}</div>
  </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // 收集所有图片链接
      const allImages = document.querySelectorAll('img');
      const imageUrls = Array.from(allImages).map(img => img.src);

      allImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function(e) {
          e.stopPropagation();
          // 发送消息到 uni-app 父页面
          const data = {
            type: 'imagePreview',
            current: this.src,    // 当前点击的图片
            urls: imageUrls       // 所有图片的 URL（用于滑动预览）
          };
          // 优先使用 uni-app 提供的 API
          if (window.uni && window.uni.webView) {
            window.uni.webView.postMessage({
              data: data
            });
          } else {
            // 兼容其他环境（如小程序 web-view）
            window.parent.postMessage(data, '*');
          }
        });
      });
    });
  </script>
</body>
</html>
    `;
  }

  /**
   * @description: 定时清理过期临时预览数据（每天凌晨 3 点）
   */
  @Cron('0 3 * * *')
  async cleanupExpiredPreviews() {
    try {
      const result = await this.previewModel.deleteMany({ expiresAt: { $lt: new Date() } });
      if (result.deletedCount > 0) {
        logger.log(`清理过期临时预览数据 ${result.deletedCount} 条`);
      }
    } catch (err) {
      logger.error(`清理过期临时预览数据 失败! ${JSON.stringify(err)}`);
    }
  }
}