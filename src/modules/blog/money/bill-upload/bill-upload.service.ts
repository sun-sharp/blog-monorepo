import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { logger } from 'src/common/journal';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { IResponse } from 'types/common';
import { useCustomConfig } from 'src/config';
import { BillUpload } from 'src/schemas/blog/money/bill-upload.schema';
import { CreateBillUploadDto } from './dto/create-bill-upload.dto';
import { PageBillUploadDto } from './dto/page-bill-upload.dto';
import { UpdateBillUploadDto } from './dto/update-bill-upload.dto';

const customConfig = useCustomConfig();
const { blogDatabaseName } = customConfig;

@Injectable()
export class BillUploadService {
  constructor(@InjectModel(BillUpload.name, blogDatabaseName) private readonly billUploadModel: Model<BillUpload>) {}

  /**
   * @description: 新增账单导入
   * @param {CreateBillUploadDto} createBillUploadDto
   * @return {Promise<IResponse>}
   */
  public create(createBillUploadDto: CreateBillUploadDto): Promise<IResponse> {
    return (
      Promise.resolve(createBillUploadDto)
        // 判断类型是否相同
        .then(async (body) => {
          const find = await this.billUploadModel.find({
            inflowOrOutflow: body.inflowOrOutflow,
            billType: body.billType,
            billMethod: body.billMethod,
            billUploadType: body.billUploadType,
            handleType: body.handleType,
            billJudgeKey: body.billJudgeKey,
            judgeWay: body.judgeWay,
          });
          if (find.length > 0) {
            throw '请切换类型，并重新保存';
          }
          return body;
        })
        // 保存
        .then(async (body) => {
          const createData = {
            billUploadType: body.billUploadType,
            billJudgeKey: body.billJudgeKey,
            judgeVal: body.judgeVal,
            judgeWay: body.judgeWay,
            handleType: body.handleType,
            inflowOrOutflow: body.inflowOrOutflow,
            billType: body.billType,
            billMethod: body.billMethod,
            priorityWeight: body.priorityWeight || 0,
          };
          await this.billUploadModel.create(createData);
          return {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.log(`新增账单导入失败！ ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '添加失败！',
          };
        })
    );
  }

  /**
   * @description: 条件并分页获取账单导入列表
   * @param {PageBillUploadDto} pageBillUploadDto
   * @return {Promise<IResponse>}
   */
  public findPage(pageBillUploadDto: PageBillUploadDto): Promise<IResponse> {
    return (
      Promise.resolve(pageBillUploadDto)
        // 查询
        .then(async (body) => {
          const { size, current, billUploadType, judgeWay, billMethod, handleType, billType } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: FilterQuery<BillUpload> = {};
          if (billUploadType) findData.billUploadType = billUploadType;
          if (judgeWay) findData.judgeWay = judgeWay;
          if (billMethod) findData.billMethod = billMethod;
          if (billType) findData.billType = billType;
          if (handleType) findData.handleType = handleType;
          const total = await this.billUploadModel.find(findData).count();
          const findArr = await this.billUploadModel.find(findData).limit(limit).skip(skip).sort({ billUploadType: 1, handleType: -1, priorityWeight: -1 });
          const list = (findArr || []).map((m) => {
            return {
              billUploadId: m.id,
              billUploadType: m.billUploadType,
              billJudgeKey: m.billJudgeKey,
              judgeVal: m.judgeVal,
              judgeWay: m.judgeWay,
              handleType: m.handleType,
              inflowOrOutflow: m.inflowOrOutflow,
              billType: m.billType,
              billMethod: m.billMethod,
              priorityWeight: m.priorityWeight,
            };
          });
          return {
            code: ApiCode.SUCCESS,
            result: { current, list, size, total },
            message: '查询成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`条件并分页获取账单导入列表 失败！${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '查询失败！',
          };
        })
    );
  }

  /**
   * @description: 修改账单导入
   * @param {UpdateBillUploadDto} updateBillUploadDto
   * @return {Promise<IResponse>}
   */
  public update(updateBillUploadDto: UpdateBillUploadDto): Promise<IResponse> {
    return (
      Promise.resolve(updateBillUploadDto)
        .then(async (body) => {
          const { billUploadId } = body;
          const updateData = {
            billUploadType: body.billUploadType,
            billJudgeKey: body.billJudgeKey,
            judgeVal: body.judgeVal,
            judgeWay: body.judgeWay,
            handleType: body.handleType,
            inflowOrOutflow: body.inflowOrOutflow,
            billType: body.billType,
            billMethod: body.billMethod,
            priorityWeight: body.priorityWeight || 0,
          };
          await this.billUploadModel.updateOne({ _id: billUploadId }, updateData);
          return {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`修改账单导入 失败！${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '修改失败！',
          };
        })
    );
  }

  /**
   * @description: 删除账单导入
   * @param {string} billUploadId
   * @return {Promise<IResponse>}
   */
  public remove(billUploadId: string): Promise<IResponse> {
    return (
      Promise.resolve(billUploadId)
        .then(async (billUploadId) => {
          await this.billUploadModel.deleteOne({ _id: billUploadId });
          return {
            code: ApiCode.SUCCESS,
            message: '删除成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          logger.error(`删除账单导入 失败！${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '删除失败！',
          };
        })
    );
  }

  /**
   * @description: 根据账单导入类型获取数据
   * @param {number} billUploadType
   * @return {Promise<BillUpload[]>}
   */
  public getDataByBillUploadType(billUploadType: number): Promise<BillUpload[]> {
    return (
      Promise.resolve(billUploadType)
        // 分页查询
        .then(async (billUploadType) => {
          const list = await this.billUploadModel.find({ billUploadType }).lean().sort({ billUploadType: 1, priorityWeight: -1 });
          return list;
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }

  /**
   * @description: 获取账单导入数据库信息
   * @return {Promise<BillUpload[]>}
   */
  public findAllToData(): Promise<BillUpload[]> {
    return (
      Promise.resolve()
        // 分页查询
        .then(async () => {
          const list = await this.billUploadModel.find();
          return list;
        })
        // 返回错误
        .catch((err) => {
          return err;
        })
    );
  }
}
