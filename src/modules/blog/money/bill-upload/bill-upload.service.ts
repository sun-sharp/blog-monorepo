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
        .then(async (body) => {
          await this.billUploadModel.create(body);
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
          const { size, current, type, label } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: FilterQuery<BillUpload> = {};
          if (type) findData.type = type;
          if (label) findData.label = { $regex: label };
          const total = await this.billUploadModel.find(findData).count();
          const findArr = await this.billUploadModel.find(findData).limit(limit).skip(skip).sort({ type: 1, value: 1 });
          const list = (findArr || []).map((m) => {
            return {
              billUploadId: m.id,
              billType: m.billType,
              billJudgeKey: m.billJudgeKey,
              judgeVal: m.judgeVal,
              judgeWay: m.judgeWay,
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
          const { billUploadId, ...other } = body;
          await this.billUploadModel.updateOne({ _id: billUploadId }, other);
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
   * @description: 获取账单导入数据库信息
   * @return {Promise<BillUpload>}
   */
  public findAllToData(): Promise<BillUpload> {
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
