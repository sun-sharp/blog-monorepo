import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { nowDateFun } from 'src/common/date';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { Article } from 'src/schemas/blog/article.schema';
import { User } from 'src/schemas/capital/user.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { PageArticleDto } from './dto/page-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { imageIsHasHttpOrHttps } from 'src/common/validator/image-validator';
import { ApiArticleItem } from 'types/blog/article';
import { IResponse } from 'types/common';
import { useCustomConfig } from 'src/config';
import { logger } from 'src/common/journal';
import { AllPageArticleDto } from './dto/all-page-article.dto';
import { BatchUpdatePrivateArticleDto } from './dto/batch-update-private-article.dto';
import { launch } from 'puppeteer';
import { Response } from 'express';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

@Injectable()
export class ArticleService {
  constructor(@InjectModel(Article.name, blogDatabaseName) private readonly articleModel: Model<Article>) {}

  /**
   * @description: 条件并分页获取不加密文章列表
   * @param {PageArticleDto} body
   * @return {Promise<IResponse>}
   */
  public findPage(body: PageArticleDto): Promise<IResponse> {
    return (
      Promise.resolve(body)
        // 分页查询
        .then(async (body) => {
          const { size, current, keywords, categoryVal } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: FilterQuery<Article> = keywords ? { $or: [{ title: { $regex: keywords } }, { brief: { $regex: keywords } }] } : {};
          if (categoryVal) {
            findData.categoryVal = categoryVal;
          }
          findData.isPrivate = false;
          const total = await this.articleModel.find(findData).count();
          const findArr = await this.articleModel.find(findData).sort({ createTime: -1 }).limit(limit).skip(skip);
          const list: ApiArticleItem[] = findArr.map((m) => ({
            articleId: m._id,
            title: m.title,
            brief: m.brief,
            htmlContent: m.htmlContent,
            cssContent: m.cssContent,
            markdownContent: m.markdownContent,
            authorId: m.authorId,
            authorNickname: m.authorNickname,
            categoryVal: m.categoryVal,
            createTime: nowDateFun(m.createTime),
          }));
          return {
            code: ApiCode.SUCCESS,
            result: { current, list, size, total },
            message: '查询成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`条件并分页获取不加密文章列表 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '查询失败！',
          };
        })
    );
  }

  /**
   * @description: 条件并分页获取文章列表
   * @param {PageArticleDto} body
   * @return {Promise<IResponse>}
   */
  public findAllPage(body: AllPageArticleDto): Promise<IResponse> {
    return (
      Promise.resolve(body)
        // 分页查询
        .then(async (body) => {
          const { size, current, keywords, categoryVal, isPrivate } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: FilterQuery<Article> = keywords ? { $or: [{ title: { $regex: keywords } }, { brief: { $regex: keywords } }] } : {};
          if (categoryVal) {
            findData.categoryVal = categoryVal;
          }
          if (typeof isPrivate === 'boolean') {
            findData.isPrivate = isPrivate;
          }
          const total = await this.articleModel.find(findData).count();
          const findArr = await this.articleModel.find(findData).sort({ createTime: -1 }).limit(limit).skip(skip);
          const list: ApiArticleItem[] = findArr.map((m) => ({
            articleId: m._id,
            title: m.title,
            brief: m.brief,
            htmlContent: m.htmlContent,
            cssContent: m.cssContent,
            markdownContent: m.markdownContent,
            authorId: m.authorId,
            authorNickname: m.authorNickname,
            categoryVal: m.categoryVal,
            createTime: nowDateFun(m.createTime),
            isPrivate: m.isPrivate,
          }));
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
   * @description: 新增文章
   * @param {User} user
   * @param {CreateArticleDto} createArticleDto
   * @return {Promise<IResponse>}
   */
  public save(user: User, createArticleDto: CreateArticleDto): Promise<IResponse> {
    return (
      Promise.resolve({ user, body: createArticleDto })
        // 添加
        .then(async ({ user, body }) => {
          await this.articleModel.create({
            title: body.title,
            brief: body.brief,
            htmlContent: body.htmlContent,
            cssContent: body.cssContent,
            markdownContent: body.markdownContent,
            categoryVal: body.categoryVal,
            createTime: nowDateFun(),
            authorId: user._id,
            authorNickname: user.nickname,
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
          const { articleId, title, brief, htmlContent, cssContent, markdownContent, categoryVal, isPrivate } = body;
          await this.articleModel.updateOne({ _id: articleId }, { title, brief, htmlContent, cssContent, markdownContent, categoryVal, isPrivate });
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
            message: err || '修改失败！',
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
            message: err || '删除失败！',
          };
        })
    );
  }

  /**
   * @description: 获取不加密文章详情
   * @return {Promise<IResponse>}
   */
  public findDetails(articleId: string): Promise<IResponse> {
    return (
      Promise.resolve(articleId)
        .then(async (articleId) => {
          const find = await this.articleModel.findOne({ _id: articleId, isPrivate: false }).lean();
          if (!find) {
            throw '获取文章详情失败';
          }
          const result: ApiArticleItem = {
            articleId: find._id,
            title: find.title,
            brief: find.brief,
            htmlContent: find.htmlContent,
            cssContent: find.cssContent,
            markdownContent: find.markdownContent,
            authorId: find.authorId,
            authorNickname: find.authorNickname,
            categoryVal: find.categoryVal,
            createTime: nowDateFun(find.createTime),
          };
          return {
            code: ApiCode.SUCCESS,
            result,
            message: '查询成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`获取不加密文章详情 失败! ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '查询失败！',
          };
        })
    );
  }

  /**
   * @description: 获取文章详情
   * @return {Promise<IResponse>}
   */
  public findAllDetails(articleId: string): Promise<IResponse> {
    return (
      Promise.resolve(articleId)
        .then(async (articleId) => {
          const find = await this.articleModel.findOne({ _id: articleId }).lean();
          if (!find) {
            throw '查询文章详情失败';
          }
          const result: ApiArticleItem = {
            articleId: find._id,
            title: find.title,
            brief: find.brief,
            htmlContent: find.htmlContent,
            cssContent: find.cssContent,
            markdownContent: find.markdownContent,
            authorId: find.authorId,
            authorNickname: find.authorNickname,
            categoryVal: find.categoryVal,
            createTime: nowDateFun(find.createTime),
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
      Promise.resolve(articleId)
        .then(async (articleId) => {
          const find = await this.articleModel.findOne({ _id: articleId }).lean();
          if (!find) {
            throw '获取文章详情失败';
          }
          const htmlBody =
            `<html>` +
            `<head>` +
            `<style>${find.cssContent}</style>` +
            `</head>` +
            `<body>` +
            `<div id="preview-only" class="md-editor md-edit-preview__cont md-editor-previewOnly">` +
            `<div id="preview-only-preview-wrapper" class="md-editor-preview-wrapper">` +
            `<article id="preview-only-preview" class="md-editor-preview default-theme">${find.htmlContent}</article>` +
            `</div>` +
            `</div>` +
            `</body>` +
            `</html>`;

          logger.error(`导出文章 html`);
          const browser = await launch();
          if (!browser) {
            throw 'browser处理失败！';
          }
          logger.error(`导出文章 browser`);

          const page = await browser.newPage();
          if (!page) {
            throw '生成page处理失败！';
          }
          logger.error(`导出文章 newPage`);

          await page.setContent(htmlBody);
          logger.error(`导出文章 setContent`);

          const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
          if (!pdfBuffer) {
            throw '生成pdfBuffer处理失败！';
          }
          logger.error(`导出文章 pdfBuffer`);

          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=article.pdf');
          res.send(pdfBuffer);

          logger.error(`导出文章 setHeader`);

          await browser.close();
          logger.error(`导出文章 browser.close `);

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
}
