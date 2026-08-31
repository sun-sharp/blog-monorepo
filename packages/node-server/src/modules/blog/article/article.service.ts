import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { nowDateFun } from 'src/common/date';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { Article } from 'src/schemas/blog/article.schema';
import { User } from 'src/schemas/capital/user.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { imageIsHasHttpOrHttps } from 'src/common/validator/image-validator';
import { ApiArticleDetails, ApiArticleMobileDetails, ApiLiteArticleItem } from '/#/api/blog/article';
import { IResponse } from '/#/common/common';
import { useCustomConfig } from 'src/config';
import { logger } from 'src/common/journal';
import { LitePageArticleDto } from './dto/lite-page-article.dto';
import { BatchUpdatePrivateArticleDto } from './dto/batch-update-private-article.dto';
import puppeteer from 'puppeteer';
import { Response } from 'express';
import { decodeBuffer, markdownToHtml } from 'src/common/markdown';
import { ArticleCssService } from '../article-css/article-css.service';
import { UserService } from 'src/modules/capital/user/user.service';
import { ArticlePolicyService } from '../article-policy/article-policy.service';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    @InjectModel(Article.name, blogDatabaseName)
    private readonly articleModel: Model<Article>,
    private readonly articleCssService: ArticleCssService,
    private readonly articlePolicyService: ArticlePolicyService,
    private readonly userService: UserService,
  ) {}

  /**
   * @description: 新增文章
   * @param {User} user
   * @param {CreateArticleDto} body
   * @return {Promise<IResponse>}
   */
  public save(user: User, body: CreateArticleDto): Promise<IResponse> {
    return (
      Promise.resolve()
        // 添加
        .then(async () => {
          await this.articleModel.create({
            title: body.title,
            brief: body.brief,
            markdownContent: body.markdownContent,
            categoryVal: body.categoryVal,
            createTime: nowDateFun(),
            authorId: user._id,
            cssName: body.cssName,
            isPrivate: body.isPrivate,
          });
          return {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`新增文章 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '添加失败！',
          };
        })
    );
  }

  /**
   * @description: 修改文章
   * @param {UpdateArticleDto} body
   * @return {Promise<IResponse>}
   */
  public update(body: UpdateArticleDto): Promise<IResponse> {
    return (
      Promise.resolve(body)
        // 修改
        .then(async (body) => {
          const { articleId, title, brief, cssName, markdownContent, categoryVal, isPrivate } = body;
          await this.articleModel.updateOne({ _id: articleId }, { title, brief, cssName, markdownContent, categoryVal, isPrivate });
          return {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`修改文章 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '修改失败！',
          };
        })
    );
  }

  /**
   * @description: 根据id批量修改文章加密
   * @param {BatchUpdatePrivateArticleDto} body
   * @return {Promise<IResponse>}
   */
  public batchUpdatePrivate(body: BatchUpdatePrivateArticleDto): Promise<IResponse> {
    return (
      Promise.resolve(body)
        // 修改
        .then(async ({ articleIdArr, isPrivate }) => {
          await this.articleModel.updateMany({ _id: { $in: articleIdArr } }, { isPrivate });
          return {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`修改文章 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: JSON.stringify(err) || '修改失败！',
          };
        })
    );
  }

  /**
   * @description: 删除文章
   * @return {Promise<IResponse>}
   */
  public remove(articleId: string): Promise<IResponse> {
    return (
      Promise.resolve(articleId)
        .then(async (articleId) => {
          await this.articleModel.deleteOne({ _id: articleId });
          return {
            code: ApiCode.SUCCESS,
            message: '删除成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`删除文章 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: JSON.stringify(err) || '删除失败！',
          };
        })
    );
  }

  /**
   * @description: 获取文章详情（支持可选认证）
   * @param {string} articleId 文章ID
   * @param {User | null} user 可选的用户信息，有用户时查询全部，无用户时只查询不加密
   * @return {Promise<IResponse>}
   */
  public findDetails(articleId: string, user?: User | null): Promise<IResponse> {
    return (
      Promise.resolve()
        .then(async () => {
          const findData: FilterQuery<Article> = { _id: articleId };
          // 如果没有用户登录，只查询不加密的文章
          if (!user) {
            findData.isPrivate = false;
          }
          const find = await this.articleModel.findOne(findData).lean();
          if (!find) {
            throw '获取文章详情失败';
          }
          const [htmlContent, cssContent] = await Promise.all([
            await markdownToHtml(find.markdownContent),
            await this.articleCssService.findOneByName(find.cssName),
          ]);
          const useLiteInfo = await this.userService.getUseLiteInfoById(find.authorId);
          const authorNickname = useLiteInfo ? (user ? user.nickname : '') : useLiteInfo.nickname;
          const result: ApiArticleDetails = {
            articleId: find._id,
            title: find.title,
            brief: find.brief,
            cssName: find.cssName,
            cssContent,
            htmlContent,
            markdownContent: find.markdownContent,
            authorId: find.authorId,
            authorNickname,
            categoryVal: find.categoryVal,
            createTime: nowDateFun(find.createTime),
            // 如果有用户登录，返回isPrivate字段；否则不返回（默认false）
            ...(user && { isPrivate: find.isPrivate }),
          };
          return {
            code: ApiCode.SUCCESS,
            result,
            message: '查询成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`获取文章详情 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '查询失败！',
          };
        })
    );
  }

  /**
   * @description: 获取手机端文章详情（支持可选认证）
   * @param {string} articleId 文章ID
   * @param {User | null} user 可选的用户信息，有用户时查询全部，无用户时只查询不加密
   * @return {Promise<IResponse>}
   */
  public findMobileDetails(articleId: string, user?: User | null): Promise<IResponse> {
    return (
      Promise.resolve()
        .then(async () => {
          const findData: FilterQuery<Article> = { _id: articleId };
          // 如果没有用户登录，只查询不加密的文章
          if (!user) {
            findData.isPrivate = false;
          }
          const find = await this.articleModel.findOne(findData).lean();
          if (!find) {
            throw '获取文章详情失败';
          }
          // 获取策略和用户信息
          const [pid, useLiteInfo] = await Promise.all([
            await this.articlePolicyService.createPolicy(find._id),
            await this.userService.getUseLiteInfoById(find.authorId),
          ]);
          const authorNickname = useLiteInfo ? (user ? user.nickname : '') : useLiteInfo.nickname;
          const result: ApiArticleMobileDetails = {
            articleId: find._id,
            title: find.title,
            brief: find.brief,
            cssName: find.cssName,
            pid,
            authorId: find.authorId,
            authorNickname,
            categoryVal: find.categoryVal,
            createTime: nowDateFun(find.createTime),
            // 如果有用户登录，返回isPrivate字段；否则不返回（默认false）
            ...(user && { isPrivate: find.isPrivate }),
          };
          return {
            code: ApiCode.SUCCESS,
            result,
            message: '查询成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`获取文章详情 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '查询失败！',
          };
        })
    );
  }

  /**
   * @description 查找文章图片的使用情况
   * @param {string} image
   * @return {Promise<User>}
   */
  public findOneByImage(image: string): Promise<Article> {
    return (
      Promise.resolve(image)
        // 图片头像是否合理
        .then(async (image) => {
          const hasHttpOrHttps = imageIsHasHttpOrHttps(image);
          if (hasHttpOrHttps)
            throw {
              code: ApiCode.ERROR,
              message: '图片保存的不合理，请处理之后再上传！',
            };
          return image;
        })
        // 判断username 是否为合法字符
        .then(async (image) => {
          return await this.articleModel.findOne({ markdownContent: { $regex: image } });
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }

  /**
   * @description: 获取文章数据库信息
   * @return {Promise<Article>}
   */
  public findAllToData(): Promise<Article> {
    return (
      Promise.resolve()
        // 分页查询
        .then(async () => {
          const list = await this.articleModel.find();
          return list;
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }

  /**
   * @description: 导出文章
   * @param {string} articleId
   * @return {Promise<IResponse | Buffer>}
   */
  public exportArticle(articleId: string, res: Response): Promise<IResponse | Buffer> {
    return (
      Promise.resolve()
        .then(async () => {
          const find = await this.articleModel.findOne({ _id: articleId }).lean();
          if (!find) {
            throw '获取文章详情失败';
          }

          const [htmlContent, cssContent] = await Promise.all([
            await markdownToHtml(find.markdownContent),
            await this.articleCssService.findOneByName(find.cssName),
          ]);

          const htmlBody =
            `<html>` +
            `<head>` +
            `<style>${cssContent}</style>` +
            `</head>` +
            `<body>` +
            `<div id="preview-only" class="md-editor md-edit-preview__cont md-editor-previewOnly">` +
            `<div id="preview-only-preview-wrapper" class="md-editor-preview-wrapper">` +
            `<div id="preview-only-preview" class="md-editor-preview ${find.cssName}-theme md-editor-scrn">${htmlContent}</div>` +
            `</div>` +
            `</div>` +
            `</body>` +
            `</html>`;
          logger.log(`导出文章 htmlBody`);

          const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            env: {
              DISPLAY: ':10.0',
            },
          });
          logger.log(`导出文章 puppeteer.launch`);

          const page = await browser.newPage();
          logger.log(`导出文章 newPage`);

          await page.setContent(htmlBody);
          logger.log(`导出文章 setContent`);

          const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
            displayHeaderFooter: true,
            headerTemplate:
              `<div style="width:100%;font-size:10px; border-bottom:1px solid #ddd; padding:10px 0; text-align: center;">` + find.title + `</div>`,
            footerTemplate:
              `<div style="width:100%;font-size:8px;border-top:1px solid #ddd;padding:10px 0;text-align:center;">` +
              `<span class="pageNumber"></span><span> / </span><span class="totalPages"></span>` +
              `</div>`,
            margin: {
              top: '60px',
              bottom: '60px',
              left: '20px',
              right: '20px',
            },
          });
          logger.log(`导出文章 pdf`);

          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=article.pdf');
          res.send(pdfBuffer);
          await browser.close();
          return pdfBuffer;
        })
        // 返回错误
        .catch((err) => {
          logger.error(`导出文章 失败! ${JSON.stringify(err)}`);
          return {
            code: ApiCode.ERROR,
            message: err || '导出文章！',
          };
        })
    );
  }

  /**
   * @description: 条件并分页获取简洁文章列表（支持可选认证）
   * @param {LitePageArticleDto} body
   * @param {User | null} user 可选的用户信息，有用户时查询全部，无用户时只查询不加密
   * @return {Promise<IResponse>}
   */
  public litePage(body: LitePageArticleDto, user?: User | null): Promise<IResponse> {
    return (
      Promise.resolve()
        // 分页查询
        .then(async () => {
          const { size, current, keywords, categoryVal, isPrivate } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: FilterQuery<Article> = keywords
            ? { $or: [{ title: { $regex: keywords, $options: 'i' } }, { brief: { $regex: keywords, $options: 'i' } }] }
            : {};
          if (categoryVal) {
            findData.categoryVal = categoryVal;
          }
          // 如果没有用户登录，只查询不加密的文章
          if (!user) {
            findData.isPrivate = false;
          } else if (typeof isPrivate === 'boolean') {
            findData.isPrivate = isPrivate;
          }
          const [total, findArr] = await Promise.all([
            this.articleModel.countDocuments(findData),
            this.articleModel
              .find(findData)
              .select('title brief authorId authorNickname categoryVal createTime isPrivate')
              .sort({ createTime: -1 })
              .limit(limit)
              .skip(skip)
              .lean()
              .exec(),
          ]);
          const list: ApiLiteArticleItem[] = findArr.map((m) => {
            const it = {
              articleId: m._id,
              title: m.title,
              brief: m.brief,
              authorId: m.authorId,
              categoryVal: m.categoryVal,
              createTime: nowDateFun(m.createTime),
            };
            if (user) {
              it['isPrivate'] = m.isPrivate;
              it['avatar'] = user.avatar;
              it['authorNickname'] = user.nickname;
            }
            return it;
          });
          return {
            code: ApiCode.SUCCESS,
            result: { current, list, size, total },
            message: '查询成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`条件并分页获取文章列表 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '查询失败！',
          };
        })
    );
  }

  /**
   * @description: 上传 MD 文件并解析为 HTML（不落盘不存库）
   * @param {Express.Multer.File} file
   * @param {string} cssName
   * @return {Promise<IResponse>}
   */
  public async uploadMd(file: Express.Multer.File, cssName: string): Promise<IResponse> {
    try {
      const mdText = decodeBuffer(file.buffer);
      if (!mdText.trim()) throw '文件内容为空';
      const [htmlContent, cssContent] = await Promise.all([await markdownToHtml(mdText), await this.articleCssService.findOneByName(cssName)]);
      logger.log(`上传 MD 文件并解析为 HTML 成功！`);
      return {
        code: ApiCode.SUCCESS,
        result: {
          markdownContent: mdText,
          htmlContent,
          cssContent,
        },
        message: '解析成功',
      };
    } catch (err) {
      logger.error(`上传 MD 文件并解析为 HTML 失败! ${JSON.stringify(err)}`);
      return {
        code: ApiCode.ERROR,
        message: `${JSON.stringify(err)}` || '上传 MD 文件并解析为 HTML 失败！',
      };
    }
  }

  /**
   * @description: 根据 policyId 查询文章 并处理成 html
   * @param {string} policyId
   * @param {Response} res
   * @return {Promise<IResponse>}
   */
  public async renderHtml(policyId: string, res: Response): Promise<Response> {
    try {
      if (!policyId) {
        logger.warn('请求缺少 pid 参数');
        return res.status(400).send('缺少参数 pid');
      }

      const articleId = await this.articlePolicyService.consumePolicy(policyId);
      if (!articleId) {
        return res.status(410).send('链接无效（策略不存在、已过期或访问次数用尽）');
      }

      const article = await this.articleModel.findOne({ _id: articleId }).lean();
      if (!article) {
        logger.warn(`文章不存在: ${articleId}`);
        return res.status(404).send('文章不存在');
      }

      const [previewHtml, cssContent] = await Promise.all([
        await markdownToHtml(article.markdownContent),
        await this.articleCssService.findOneByName(article.cssName),
      ]);

      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${article.title || '文章'}</title>
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
    /* 可加其他自定义样式 */
  </style>
</head>
<body>
  <div id="preview-only" class="md-editor md-edit-preview__cont md-editor-previewOnly">
  <div id="preview-only-preview-wrapper" class="md-editor-preview-wrapper">
  <div id="preview-only-preview" class="md-editor-preview ${article.cssName}-theme md-editor-scrn">${previewHtml}</div>
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

      //   handleMessage(event) {
      //   const data = event.detail.data;
      //   if (data.type === 'imagePreview') {
      //     uni.previewImage({
      //       current: data.current,
      //       urls: data.urls
      //     });
      //   }
      // }
      logger.log(`导出文章 htmlBody`);
      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    } catch (err) {
      logger.error(`根据 policyId 查询文章 并处理成 html 失败! ${JSON.stringify(err)}`);
      return res.status(500).send('服务器内部错误，请稍后重试');
    }
  }
}
