import { Injectable, Logger } from '@nestjs/common';
import { CreateUricDto } from './dto/create-uric.dto';
// import { UpdateUricDto } from './dto/update-uric.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Uric } from 'src/schemas/capital/uric.schema';
import { useCustomConfig } from 'src/config';
import { FilterQuery, Model } from 'mongoose';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { IResponse } from '/#/common';
import { PageUricDto } from './dto/page-uric.dto';
import { PaginateHandle } from 'src/common/paginate/paginate-handle';
import { ApiUricItem } from '/#/api/capital/uric';
import { nowDateFun } from 'src/common/date';
import { UpdateUricDto } from './dto/update-uric.dto';

const customConfig = useCustomConfig();
const { capitalDatabaseName } = customConfig;

@Injectable()
export class UricService {
  private readonly logger = new Logger(UricService.name);

  constructor(@InjectModel(Uric.name, capitalDatabaseName) private readonly uricModel: Model<Uric>) {}

  /**
   * @description: 新增尿酸血糖测量记录
   * @param {string} userId 创建的用户id
   * @param {CreateUricDto} body
   * @return {Promise<IResponse>}
   */
  public create(userId: string, body: CreateUricDto): Promise<IResponse> {
    return (
      Promise.resolve()
        // 处理全局类型标识重复问题
        .then(async () => {
          const { measureTime, measureType, bloodGlucose = null, uricAcid = null, bloodSugarPeriod } = body;
          if (!uricAcid && !bloodGlucose) {
            throw '至少输入一种测量值';
          }
          return { measureTime, uricAcid, bloodGlucose, measureType, bloodSugarPeriod, userId };
        })
        // 添加
        .then(async (body) => {
          await this.uricModel.create(body);
          this.logger.log(`新增尿酸血糖测量记录成功！`);
          return {
            code: ApiCode.SUCCESS,
            message: '添加成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          this.logger.error(`新增尿酸血糖测量记录失败！ ${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '添加失败！',
          };
        })
    );
  }

  /**
   * @description: 条件并分页获取尿酸血糖测量记录列表
   * @param {PageUricDto} body
   * @return {Promise<IResponse>}
   */
  public listPage(body: PageUricDto): Promise<IResponse> {
    return (
      Promise.resolve()
        // 查询
        .then(async () => {
          const { size, current, measureType } = body;
          const { limit, skip } = PaginateHandle(size, current);
          const findData: FilterQuery<Uric> = {};
          if (measureType) findData.measureType = measureType;
          const [total, findArr] = await Promise.all([
            this.uricModel.countDocuments(findData),
            this.uricModel.find(findData).sort({ measureTime: -1 }).limit(limit).skip(skip).lean().exec(),
          ]);
const list: ApiUricItem[] = (findArr || []).map((m) => {
    return {
      uricId: m._id,
      measureTime: nowDateFun(m.measureTime),
      uricAcid: m.uricAcid,
      bloodGlucose: m.bloodGlucose,
      measureType: m.measureType,
      bloodSugarPeriod: m.bloodSugarPeriod,
      userId: m.userId,
    };
  });
          this.logger.log(`条件并分页获取尿酸血糖测量记录列表成功！`);
          return {
            code: ApiCode.SUCCESS,
            result: { current, list, size, total },
            message: '查询成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          this.logger.error(`条件并分页获取尿酸血糖测量记录列表 失败！${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '查询失败！',
          };
        })
    );
  }

  /**
   * @description: 查找尿酸血糖测量记录详情
   * @param {string} uricId
   * @return {Promise<IResponse>}
   */
  public details(uricId: string): Promise<IResponse> {
    return Promise.resolve()
      .then(async () => {
        const m = await this.uricModel.findOne({ _id: uricId }).lean();
        if (!m) throw '尿酸血糖测量记录不存在';
        const result: ApiUricItem = {
          uricId: m.id,
          measureTime: nowDateFun(m.measureTime),
          uricAcid: m.uricAcid,
          bloodGlucose: m.bloodGlucose,
          measureType: m.measureType,
          bloodSugarPeriod: m.bloodSugarPeriod,
          userId: m.userId,
        };
        this.logger.log(`查找尿酸血糖测量记录详情 成功！`);
        return {
          code: ApiCode.SUCCESS,
          result,
          message: '查询成功！',
        };
      })
      .catch((err) => {
        this.logger.error(`查找尿酸血糖测量记录详情 失败！${err}`);
        return {
          code: ApiCode.ERROR,
          message: err || '查询失败！',
        };
      });
  }

  /**
   * @description: 修改尿酸血糖测量记录
   * @param {UpdateUricDto} body
   * @return {Promise<IResponse>}
   */
  public update(body: UpdateUricDto): Promise<IResponse> {
    return (
      Promise.resolve()
        // 修改
        .then(async () => {
          const { uricId, measureTime, measureType, bloodGlucose = null, uricAcid = null, bloodSugarPeriod } = body;
          if (!uricAcid && !bloodGlucose) {
            throw '至少输入一种测量值';
          }
          return { uricId, measureTime, uricAcid, bloodGlucose, measureType, bloodSugarPeriod };
        })
        .then(async ({ uricId, ...other }) => {
          await this.uricModel.updateOne({ _id: uricId }, other);
          this.logger.log(`修改尿酸血糖测量记录 成功！`);
          return {
            code: ApiCode.SUCCESS,
            message: '修改成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          this.logger.error(`修改尿酸血糖测量记录 失败！${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '修改失败！',
          };
        })
    );
  }

  /**
   * @description: 删除尿酸血糖测量记录
   * @param {string} uricId
   * @return {Promise<IResponse>}
   */
  public remove(uricId: string): Promise<IResponse> {
    return (
      Promise.resolve()
        .then(async () => {
          await this.uricModel.deleteOne({ _id: uricId });
          this.logger.log(`删除尿酸血糖测量记录 成功！`);
          return {
            code: ApiCode.SUCCESS,
            message: '删除成功！',
          };
        })
        // 返回错误
        .catch((err) => {
          this.logger.error(`删除尿酸血糖测量记录 失败！${err}`);
          return {
            code: ApiCode.ERROR,
            message: err || '删除失败！',
          };
        })
    );
  }
}
