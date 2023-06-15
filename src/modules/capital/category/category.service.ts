import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { logger } from 'src/common/journal';
import { IResponse } from 'src/interfaces/response.interface';
import { Category } from 'src/schemas/capital/category.schema';

@Injectable()
export class CategoryService {
  response: IResponse;
  constructor(@InjectModel('Category') private readonly categoryModel: Model<Category>) {}

  /**
   * @description: 某种类型的所以配置
   * @param {string} type
   * @return {Promise<IResponse>}
   */
  public certainTypeAll(type: string): Promise<IResponse> {
    return (
      Promise.resolve(type)
        // 查询
        .then(async (type) => {
          const result = await this.findByType(type);
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: result.map((m) => ({
              categoryId: m._id,
              type: m.type,
              valueStr: m.valueStr,
              value: m.value,
              label: m.label,
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
   * @description: 获取某个类型的全部分类列表
   * @param {string} type
   * @return {Promise<IResponse>}
   */
  public findByType(type: string): Promise<Category[]> {
    return (
      Promise.resolve(type)
        // 查询
        .then(async (type) => {
          return await this.categoryModel.find({ type }).sort({ value: 1 });
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }
}
