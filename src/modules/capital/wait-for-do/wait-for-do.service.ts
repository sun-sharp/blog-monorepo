import { Injectable } from '@nestjs/common';
import { CreateWaitForDoDto } from './dto/create-wait-for-do.dto';
import { IResponse } from 'src/interfaces/response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WaitForDo } from 'src/schemas/capital/wait-for-do.schema';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { logger } from 'src/common/journal';

@Injectable()
export class WaitForDoService {
  response: IResponse;
  constructor(@InjectModel('WaitForDo') private readonly waitForDoModel: Model<WaitForDo>) {}

  /**
   * @description: 新增文章分类
   * @param {CreateArticleCategoryDto} createArticleCategoryDto
   * @return {*}
   */
  public save(createArticleCategoryDto: CreateWaitForDoDto): Promise<IResponse> {
    return (
      Promise.resolve(createArticleCategoryDto)
        // 处理排序问题
        .then(async (body) => {
          const findCount = await this.waitForDoModel.find().count();
          if (typeof findCount === 'number') {
            return {
              ...body,
              sort: findCount + 1,
            };
          } else {
            throw (this.response = {
              code: ApiCode.ERROR,
              message: '处理排序问题失败！',
            });
          }
        })
        // 处理时间
        .then(async (body) => {
          return {
            ...body,
            deadline: new Date(body.deadline),
          };
        })
        // 添加
        .then(async (body) => {
          const createBody = { ...body, isRemove: false };
          await this.waitForDoModel.create(createBody);
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
}
