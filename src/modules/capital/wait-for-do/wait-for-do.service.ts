import { Injectable } from '@nestjs/common';
import { CreateWaitForDoDto } from './dto/create-wait-for-do.dto';
import { IResponse } from 'src/interfaces/response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WaitForDo } from 'src/schemas/capital/wait-for-do.schema';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { logger } from 'src/common/journal';
import { isDateFormat } from 'src/common/date';
import { UpdateWaitForDoStateDto } from './dto/update-wait-for-do-state.dto';

@Injectable()
export class WaitForDoService {
  response: IResponse;
  constructor(@InjectModel('WaitForDo') private readonly waitForDoModel: Model<WaitForDo>) {}

  /**
   * @description: 新增文章分类
   * @param {CreateWaitForDoDto} createWaitForDoDto
   * @return {*}
   */
  public save(userId: string, createWaitForDoDto: CreateWaitForDoDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body: createWaitForDoDto })
        // 处理时间
        .then(async ({ userId, body }) => {
          const { deadline } = body;
          if (deadline && !isDateFormat(deadline)) {
            throw (this.response = {
              code: ApiCode.ERROR,
              message: '截止时间格式不对',
            });
          }
          return {
            ...body,
            userId,
            deadline: deadline ? new Date(deadline) : '',
          };
        })
        // 处理排序问题
        .then(async (body) => {
          const findCount = await this.waitForDoModel.find().count();
          if (typeof findCount === 'number') {
            return {
              ...body,
              sort: findCount + 1,
              isRemove: false,
            };
          } else {
            throw (this.response = {
              code: ApiCode.ERROR,
              message: '处理排序问题失败！',
            });
          }
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

  /**
   * @description: 某种类型，状态的所有待办
   * @param {number} classify
   * @param {number} state
   * @return {Promise<IResponse>}
   */
  public classifyAll(classify: number, state: number): Promise<IResponse> {
    return (
      Promise.resolve({ classify, state })
        // 查询
        .then(async ({ classify, state }) => {
          const result = await this.findByClassify(classify, state);
          return (this.response = {
            code: ApiCode.SUCCESS,
            result: result.map((m) => ({
              waitForDoId: m._id,
              title: m.title,
              classify: m.classify,
              deadline: m.deadline,
              remark: m.remark,
              state: m.state,
              sort: m.sort,
              userId: m.userId,
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
   * @description: 获取某个类型，状态，没有删除的全部待办列表
   * @param {number} classify
   * @param {number} state
   * @return {Promise<WaitForDo[]>}
   */
  public findByClassify(classify: number, state: number): Promise<WaitForDo[]> {
    return (
      Promise.resolve({ classify, state })
        // 查询
        .then(async ({ classify, state }) => {
          return await this.waitForDoModel.find({ classify, state, isRemove: false }).sort({ sort: 1 });
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }

  /**
   * @description: 修改配置信息
   * @param {string} userId
   * @param {UpdateWaitForDoStateDto} updateWaitForDoStateDto
   * @return {Promise<IResponse>}
   */
  public updateState(userId: string, updateWaitForDoStateDto: UpdateWaitForDoStateDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body: updateWaitForDoStateDto })
        // 修改
        .then(async ({ userId, body }) => {
          await this.waitForDoModel.updateOne({ userId }, body);
          return (this.response = {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          });
        })
        // 返回错误
        .catch((err) => {
          return (this.response = {
            code: ApiCode.ERROR,
            message: err.message || '修改失败！',
          });
        })
    );
  }
}
