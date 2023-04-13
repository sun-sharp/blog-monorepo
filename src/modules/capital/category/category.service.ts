import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IResponse } from 'src/interfaces/response.interface';
import { Category } from 'src/schemas/capital/category.schema';

@Injectable()
export class CategoryService {
  response: IResponse;
  constructor(@InjectModel('Category') private readonly categoryModel: Model<Category>) {}

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
          return await this.categoryModel.find({ type });
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }
}
