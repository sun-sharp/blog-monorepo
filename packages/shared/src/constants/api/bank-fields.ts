import { AliPayBaseFields, AliPayCreateFields, ApiAliPayUpload } from "/#/api/blog/money/ali-pay";
import { ApiBankUpload, BankBaseFields, BankCreateFields } from "/#/api/blog/money/bank";
import { FieldConfig } from "/#/api/common";

export const bankBaseFieldsMap: Record<keyof BankBaseFields, FieldConfig> = {
  tradeTime: { label: '交易时间', type: 'string' },
  tradeType: { label: '交易类型', type: 'string' },
  bankType: { label: '银行类型', type: 'number' },
  voucherType: { label: '凭证类型', type: 'number' },
  voucherNo: { label: '凭证号码', type: 'string' },
  tradeOtherPerson: { label: '交易对方', type: 'string' },
  tradeOtherPersonAccount: { label: '交易对方账号', type: 'string' },
  tradeOtherPersonRemarks: { label: '交易对方备注', type: 'string' },
  incomeOrPay: { label: '收/支', type: 'string' },
  moneyAmount: { label: '交易金额', type: 'number' },
  balance: { label: '余额', type: 'number' },
  otherCost: { label: '其它费用', type: 'number' },
  explain: { label: '账单说明', type: 'string' },
  place: { label: '使用地点', type: 'string' },
};

export const bankCreateFieldsMap: Record<keyof BankCreateFields, FieldConfig> = {
  inflowOrOutflow: { label: '流入/流出', type: 'number' },
  bankBillType: { label: '银行账单类型', type: 'number' },
};

// ============ 3. 最终导入字段映射（基于 ApiBankUpload） ============
type ApiBankUploadKeys = keyof ApiBankUpload; // 自动推导为联合类型

// 对象的键必须恰好是 ApiBankUpload 的所有字段
export const bankUploadFieldsMap: Record<keyof ApiBankUpload, FieldConfig> = {
  ...bankBaseFieldsMap,
  ...bankCreateFieldsMap,
};

// 如果需要数组形式，可通过 Object.values 转换
export const bankUploadFields = Object.entries(bankUploadFieldsMap).map(([key, meta]) => ({
  key: key as keyof ApiBankUpload, // 类型断言，确保键合法
  label: meta.label,
  type: meta.type,
}));