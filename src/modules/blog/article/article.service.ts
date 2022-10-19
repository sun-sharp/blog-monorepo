import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nowDateFun } from 'src/common/date';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { IResponse } from 'src/interfaces/response.interface';
import { Article } from 'src/schemas/blog/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { PageArticleDto } from './dto/page-article.dto';

@Injectable()
export class ArticleService {
  response: IResponse;
  constructor(@InjectModel('Article') private readonly articleModel: Model<Article>) {}

  /**
   * @description: 条件并分页获取文章列表
   * @param {PageArticleDto} body
   * @return {Promise<IResponse>}
   */
  public findPage(body: PageArticleDto): Promise<IResponse> {
    return (
      Promise.resolve(body)
        // 分页查询
        .then(async (body) => {
          const { size, current, title } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData = { title: { $regex: title } };
          const total = await this.articleModel.find(findData).count();
          const list = await this.articleModel.find(findData).limit(limit).skip(skip);
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: {
              current,
              list: list.map((m) => ({
                articleId: m._id,
                title: m.title,
                brief: m.brief,
                htmlContent: m.htmlContent,
                markdownContent: m.markdownContent,
                authorId: m.authorId,
                authorNickname: m.authorNickname,
                categoryVal: m.categoryVal,
                categoryName: m.categoryName,
                createTime: m.createTime,
              })),
              size,
              total,
            },
            message: '查询成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '查询失败！',
          });
        })
    );
  }

  public save(user, createArticleDto: CreateArticleDto): Promise<IResponse> {
    return (
      Promise.resolve({ user, body: createArticleDto })
        // 添加
        .then(async ({ user, body }) => {
          const { categoryVal } = body;
          console.log(categoryVal, 'categoryVal');
          await this.articleModel.create({
            ...body,
            createTime: nowDateFun(),
            authorId: user.userId,
            authorNickname: user.nickname,
          });
          return (this.response = {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '添加失败！',
          });
        })
    );
  }
}
