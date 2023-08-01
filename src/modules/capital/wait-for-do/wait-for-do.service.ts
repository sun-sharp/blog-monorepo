import { Injectable } from '@nestjs/common';
import { CreateWaitForDoDto } from './dto/create-wait-for-do.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WaitForDo } from 'src/schemas/capital/wait-for-do.schema';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { logger } from 'src/common/journal';
import { isDateFormat, nowDateFun } from 'src/common/date';
import { UpdateWaitForDoStateDto } from './dto/update-wait-for-do-state.dto';
import { UpdateWaitForDoSortDto } from './dto/update-wait-for-do-sort.dto';
import { UpdateWaitForDoDto } from './dto/update-wait-for-do.dto';
import { IResponse } from 'types/common';
import { ApiWaitForDoItem } from 'types/capital/wait-for-do';

@Injectable()
export class WaitForDoService {
  constructor(@InjectModel('WaitForDo') private readonly waitForDoModel: Model<WaitForDo>) {}

  /**
   * @description: 新增文章分类
   * @param {CreateWaitForDoDto} createWaitForDoDto
   * @return {Promise<IResponse>}
   */
  public save(userId: string, createWaitForDoDto: CreateWaitForDoDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body: createWaitForDoDto })
        // 处理时间
        .then(async ({ userId, body }) => {
          const { deadline } = body;
          if (deadline && !isDateFormat(deadline)) {
            throw {
              code: ApiCode.ERROR,
              message: '截止时间格式不对',
            };
          }
          return {
            ...body,
            userId,
            deadline: deadline ? new Date(deadline) : null,
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
            throw {
              code: ApiCode.ERROR,
              message: '处理排序问题失败！',
            };
          }
        })
        // 添加
        .then(async (body) => {
          const createBody = { ...body, isRemove: false };
          await this.waitForDoModel.create(createBody);
          return {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.log(`返回错误`, err);
          return {
            code: ApiCode.ERROR,
            message: err.message || '添加失败！',
          };
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
          const findArr = await this.findByClassify(classify, state);
          const result = findArr.map((m) => {
            const item: ApiWaitForDoItem = {
              waitForDoId: m._id,
              title: m.title,
              classify: m.classify,
              remark: m.remark,
              state: m.state,
              sort: m.sort,
              userId: m.userId,
              isRemove: m.isRemove,
            };
            if (m.deadline) {
              item.deadline = nowDateFun(m.deadline);
            }
            return item;
          });
          return {
            code: ApiCode.SUCCESS,
            result,
            message: '查询成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.log(`返回错误`, err);
          return {
            code: ApiCode.ERROR,
            message: err.message || '查询失败！',
          };
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
          return await this.waitForDoModel.find({ classify, state, isRemove: false }).sort({ sort: -1 });
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }

  /**
   * @description: 修改待办的状态
   * @param {string} userId
   * @param {UpdateWaitForDoStateDto} updateWaitForDoStateDto
   * @return {Promise<IResponse>}
   */
  public updateState(userId: string, updateWaitForDoStateDto: UpdateWaitForDoStateDto): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body: updateWaitForDoStateDto })
        // 修改
        .then(async ({ userId, body }) => {
          const { waitForDoId, state } = body;
          await this.waitForDoModel.updateOne({ userId, _id: waitForDoId }, { state });
          return {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '修改失败！',
          };
        })
    );
  }

  /**
   * @description: 批量修改待办的排序
   * @param {string} userId
   * @param {UpdateWaitForDoSortDto[]} updateWaitForDoSortDtoArr
   * @return {Promise<IResponse>}
   */
  public updateSort(userId: string, updateWaitForDoSortDtoArr: UpdateWaitForDoSortDto[]): Promise<IResponse> {
    return (
      Promise.resolve({ userId, body: updateWaitForDoSortDtoArr })
        // 修改
        .then(async ({ userId, body }) => {
          for (let i = body.length; i > 0; i--) {
            const dto = body[body.length - i];
            const { waitForDoId } = dto;
            await this.waitForDoModel.updateOne({ userId, _id: waitForDoId }, { sort: i });
          }
          return {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '修改失败！',
          };
        })
    );
  }

  /**
   * @description: 修改待办的名称，备注，截止时间
   * @param {UpdateWaitForDoDto} updateWaitForDoDto
   * @return {Promise<IResponse>}
   */
  public update(updateWaitForDoDto: UpdateWaitForDoDto): Promise<IResponse> {
    return (
      Promise.resolve(updateWaitForDoDto)
        // 处理时间
        .then(async (body) => {
          const { deadline } = body;
          if (deadline && !isDateFormat(deadline)) {
            throw {
              code: ApiCode.ERROR,
              message: '截止时间格式不对',
            };
          }
          return { ...body, deadline: deadline ? new Date(deadline) : null };
        })
        // 修改
        .then(async (body) => {
          const { waitForDoId, ...other } = body;
          await this.waitForDoModel.updateOne({ _id: waitForDoId }, other);
          return {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '修改失败！',
          };
        })
    );
  }

  /**
   * @description: 查询待办详情
   * @param {string} waitForDoId
   * @return {Promise<IResponse>}
   */
  public findDetails(waitForDoId: string): Promise<IResponse> {
    return (
      Promise.resolve(waitForDoId)
        .then(async (waitForDoId) => {
          const result = await this.waitForDoModel.findOne({ _id: waitForDoId }).lean();
          if (!result) {
            throw {
              code: ApiCode.ERROR,
              message: '查询待办详情失败',
            };
          }
          let deadline = undefined;
          if (result.deadline) {
            deadline = nowDateFun(result.deadline);
          }
          return {
            code: ApiCode.SUCCESS,
            result: {
              ...result,
              deadline,
            },
            message: '查询成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '查询失败！',
          };
        })
    );
  }

  /**
   * @description: 删除待办
   * @param {string} waitForDoId
   * @return {Promise<IResponse>}
   */
  public remove(waitForDoId: string): Promise<IResponse> {
    return (
      Promise.resolve(waitForDoId)
        // 删除
        .then(async (waitForDoId) => {
          await this.waitForDoModel.deleteOne({ _id: waitForDoId });
          return {
            code: ApiCode.SUCCESS,
            message: '删除成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          return {
            code: ApiCode.ERROR,
            message: err.message || '删除失败！',
          };
        })
    );
  }
}
