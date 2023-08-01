import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { logger } from 'src/common/journal';
import { IResponse } from 'src/interfaces/response.interface';
import { ArticleCategory } from 'src/schemas/blog/article-category.schema';
import { CreateArticleCategoryDto } from './dto/create-article-category.dto';
// import { UpdateArticleCategoryDto } from './dto/update-article-category.dto';

@Injectable()
export class ArticleCategoryService {
  response: IResponse;
  constructor(@InjectModel('ArticleCategory') private readonly articleCategoryModel: Model<ArticleCategory>) {}

  /**
   * @description: 新增文章分类
   * @param {CreateArticleCategoryDto} createArticleCategoryDto
   * @return {Promise<IResponse>}
   */
  public save(createArticleCategoryDto: CreateArticleCategoryDto): Promise<IResponse> {
    return (
      Promise.resolve(createArticleCategoryDto)
        // 判断分类是否存在
        .then(async (body) => {
          const { name } = body;
          const findOne = await this.articleCategoryModel.findOne({ name });
          if (findOne) {
            throw (this.response = {
              code: ApiCode.ERROR,
              message: '分类已添加',
            });
          }
          const findAll = await this.articleCategoryModel.find().sort({ value: 1 });
          if (findAll && findAll.length > 0) {
            return {
              value: findAll[findAll.length - 1].value + 1,
              name,
            };
          } else {
            throw (this.response = {
              code: ApiCode.ERROR,
              message: '查询分类最新添加的失败',
            });
          }
        })
        // 添加
        .then(async (body) => {
          await this.articleCategoryModel.create({
            ...body,
          });
          return (this.response = {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          logger.log(`返回错误`, err);
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '添加失败！',
          });
        })
    );
  }

  /**
   * @description: 根据文章分类标识value查找文章分类详情
   * @param {number} value
   * @return {Promise<IResponse>}
   */
  public findOneByValue(value: number): Promise<ArticleCategory> {
    return (
      Promise.resolve(value)
        .then(async (value) => {
          return await this.articleCategoryModel.findOne({ value }, { _id: 0 });
        })
        // 返回错误
        .catch((err) => {
          logger.log(`返回错误`, err);
          return err;
        })
    );
  }

  /**
   * @description: 获取全部文章分类列表
   * @return {Promise<IResponse>}
   */
  public findAll(): Promise<IResponse> {
    return (
      Promise.resolve()
        // 查询
        .then(async () => {
          const result = await this.articleCategoryModel.find().sort({ value: 1 });
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: result.map((m) => ({
              articleCategoryId: m._id,
              value: m.value,
              name: m.name,
            })),
            message: '查询成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          logger.log(`返回错误`, err);
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '查询失败！',
          });
        })
    );
  }

  /**
   * @description: 删除文章分类
   * @return {Promise<IResponse>}
   */
  public remove(articleCategoryId: string): Promise<IResponse> {
    return (
      Promise.resolve(articleCategoryId)
        .then(async (articleCategoryId) => {
          await this.articleCategoryModel.deleteOne({ _id: articleCategoryId });
          return (this.response = {
            code: ApiCode.SUCCESS,
            message: '删除成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '删除失败！',
          });
        })
    );
  }
}
