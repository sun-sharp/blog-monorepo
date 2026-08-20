import { Injectable, Logger } from '@nestjs/common';
import { CreateUricDto } from './dto/create-uric.dto';
// import { UpdateUricDto } from './dto/update-uric.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Uric } from 'src/schemas/capital/uric.schema';
import { useCustomConfig } from 'src/config';
import { Model } from 'mongoose';
import { ApiCode } from 'src/common/enums/api-code.enum';
import { IResponse } from '/#/common';

const customConfig = useCustomConfig();
const { capitalDatabaseName } = customConfig;

@Injectable()
export class UricService {
  private readonly logger = new Logger(UricService.name);

  constructor(@InjectModel(Uric.name, capitalDatabaseName) private readonly uricModel: Model<Uric>) {}

  /**
   * @description: 新增尿酸血糖测量记录
   * @param {CreateUricDto} body
   * @return {Promise<IResponse>}
   */
  public create(body: CreateUricDto): Promise<IResponse> {
    return (
      Promise.resolve()
        // 处理全局类型标识重复问题
        .then(async () => {
          const { measureTime, measureType, bloodGlucose = null, uricAcid = null } = body;
          if (!uricAcid && !bloodGlucose) {
            throw '至少输入一种测量值';
          }
          return { measureTime, uricAcid, bloodGlucose, measureType };
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
}
