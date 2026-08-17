import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { logger } from 'src/common/journal';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { IResponse } from '/#/common/common';
import { useCustomConfig } from 'src/config';
import { BillUpload } from 'src/schemas/blog/money/bill-upload.schema';
import { CreateBillUploadDto } from './dto/create-bill-upload.dto';
import { PageBillUploadDto } from './dto/page-bill-upload.dto';
import { UpdateBillUploadDto } from './dto/update-bill-upload.dto';
import { ApiBillUploadItem } from '/#/api/blog/bill-upload';
import { validBillUploadCode, validBillUploadCodeExecut, codeFieldWhitelist } from 'src/common/validator/code-validator';

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
          // 校验 code 引用的字段是否合法
          const fieldErr = validBillUploadCode(body.billUploadType, body.code);
          if (fieldErr) {
            throw fieldErr;
          }
          // 校验 code 可执行性（用示例数据跑一遍）
          const sampleItem = this.buildSampleItem(body.billUploadType);
          if (!validBillUploadCodeExecut(body.code, sampleItem)) {
            throw '代码无法正常执行，请检查代码语法或其判断逻辑';
          }
          // 数据库防重：同一类型+需处理类型+条件配置 只允许一条
          const find = await this.billUploadModel.find({
            inflowOrOutflow: body.inflowOrOutflow,
            billType: body.billType,
            billMethod: body.billMethod,
            billUploadType: body.billUploadType,
            handleType: body.handleType,
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
            handleType: body.handleType,
            inflowOrOutflow: body.inflowOrOutflow,
            billType: body.billType,
            billMethod: body.billMethod,
            code: body.code,
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
            message: `${err}` || '添加失败！',
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
          const { size, current, billUploadType, billMethod, handleType, billType } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: FilterQuery<BillUpload> = {};
          if (billUploadType) findData.billUploadType = billUploadType;
          if (billMethod) findData.billMethod = billMethod;
          if (billType) findData.billType = billType;
          if (handleType) findData.handleType = handleType;
          const total = await this.billUploadModel.find(findData).count();
          const findArr = await this.billUploadModel.find(findData).limit(limit).skip(skip).sort({ billUploadType: 1, handleType: -1, priorityWeight: -1 });
          const list: ApiBillUploadItem[] = (findArr || []).map((m) => {
            return {
              billUploadId: m.id,
              billUploadType: m.billUploadType,
              handleType: m.handleType,
              inflowOrOutflow: m.inflowOrOutflow,
              billType: m.billType,
              billMethod: m.billMethod,
              code: m.code,
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
            message: `${err}` || '查询失败！',
          };
        })
    );
  }

  /**
   * @description: 根据billUploadId查找账单导入详情
   * @param {string} billUploadId
   * @return {Promise<IResponse>}
   */
  public findOneByBillUploadId(billUploadId: string): Promise<IResponse> {
    return Promise.resolve(billUploadId)
      .then(async (billUploadId) => {
        const m = await this.billUploadModel.findOne({ _id: billUploadId });
        if (!m) throw '账单导入不存在';
        const result: ApiBillUploadItem = {
          billUploadId: m.id,
          billUploadType: m.billUploadType,
          handleType: m.handleType,
          inflowOrOutflow: m.inflowOrOutflow,
          billType: m.billType,
          billMethod: m.billMethod,
          code: m.code,
        };
        return {
          code: ApiCode.SUCCESS,
          result,
          message: '查询成功！',
        };
      })
      .catch((err) => {
        logger.error(`根据billUploadId查找账单导入详情 失败！${err}`);
        return {
          code: ApiCode.ERROR,
          message: `${err}` || '查询失败！',
        };
      });
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
          // 校验 code 引用的字段是否合法
          const fieldErr = validBillUploadCode(body.billUploadType, body.code);
          if (fieldErr) {
            throw fieldErr;
          }
          // 校验 code 可执行性
          const sampleItem = this.buildSampleItem(body.billUploadType);
          if (!validBillUploadCodeExecut(body.code, sampleItem)) {
            throw '代码无法正常执行，请检查代码语法或其判断逻辑';
          }
          // 数据库防重（排除当前记录本身）
          const find = await this.billUploadModel.find({
            _id: { $ne: billUploadId },
            inflowOrOutflow: body.inflowOrOutflow,
            billType: body.billType,
            billMethod: body.billMethod,
            billUploadType: body.billUploadType,
            handleType: body.handleType,
          });
          if (find.length > 0) {
            throw '请切换类型，并重新保存';
          }
          const updateData = {
            billUploadType: body.billUploadType,
            handleType: body.handleType,
            inflowOrOutflow: body.inflowOrOutflow,
            billType: body.billType,
            billMethod: body.billMethod,
            code: body.code,
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
            message: `${err}` || '修改失败！',
          };
        })
    );
  }

  /**
   * @description: 根据账单导入类型构建一条示例 item 数据，用于 code 可执行性校验
   * @param {number} billUploadType 账单导入类型
   * @return {Record<string, any>}
   */
  private buildSampleItem(billUploadType: number): Record<string, any> {
    const sample: Record<string, any> = {};
    // 各类型可用的 item 字段
    const allowFields = this.getAllowFields(billUploadType);
    allowFields.forEach((field) => {
      sample[field] = field === 'moneyAmount' ? 0 : '';
    });
    return sample;
  }

  /**
   * @description: 获取指定账单导入类型允许引用的 item 字段集合
   */
  private getAllowFields(billUploadType: number): string[] {
    return codeFieldWhitelist[billUploadType] || [];
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
            message: `${err}` || '删除失败！',
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
          logger.error(`获取账单导入数据库信息 失败! ${err}`);
          return err;
        })
    );
  }
}
