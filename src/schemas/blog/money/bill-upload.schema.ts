import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * @description 账单导入数据字段
 * @export
 * @class BillUpload
 * @extends {Document}
 */
@Schema({
  versionKey: false,
})
export class BillUpload extends Document {
  // 账单导入类型
  @Prop()
  billUploadType: number;

  // 账单类型
  @Prop()
  billType: number;

  // 账单判断字段
  @Prop()
  billJudgeKey: string;

  // 判断方式
  @Prop()
  judgeWay: string;

  // 判断取值
  @Prop()
  judgeVal: Array<string>;
}

export const BillUploadSchema = SchemaFactory.createForClass(BillUpload);
