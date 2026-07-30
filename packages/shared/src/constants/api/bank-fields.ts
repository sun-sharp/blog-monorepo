import { AliPayBaseFields, AliPayCreateFields, ApiAliPayUpload } from "/#/api/blog/money/ali-pay";
import { ApiBankUpload, BankBaseFields, BankCreateFields } from "/#/api/blog/money/bank";
import { FieldConfig } from "/#/api/common";

export const bankBaseFieldsMap: Record<keyof BankBaseFields, FieldConfig> = {
  tradeTime: { label: '交易时间', type: 'string' }, // 账单交易发生的时间
  tradeType: { label: '交易类型', type: 'string' }, // 交易的渠道类型，如"网银转账"、"ATM取款"等
  bankType: { label: '银行类型', type: 'number' }, // 系统定义的银行分类，如工商银行、招商银行等
  voucherType: { label: '凭证类型', type: 'number' }, // 银行交易的凭证类型
  voucherNo: { label: '凭证号码', type: 'string' }, // 银行交易的凭证编号
  tradeOtherPerson: { label: '交易对方', type: 'string' }, // 交易对方的户名
  tradeOtherPersonAccount: { label: '交易对方账号', type: 'string' }, // 交易对方的银行账号
  tradeOtherPersonRemarks: { label: '交易对方备注', type: 'string' }, // 对交易对方的备注
  incomeOrPay: { label: '收/支', type: 'string' }, // 收入或支出标识
  moneyAmount: { label: '交易金额', type: 'number' }, // 交易金额，单位为元
  balance: { label: '余额', type: 'number' }, // 交易后的账户余额
  otherCost: { label: '其它费用', type: 'number' }, // 其它附加费用
  explain: { label: '账单说明', type: 'string' }, // 账单的摘要/说明
  place: { label: '使用地点', type: 'string' }, // 交易发生的地点
};

export const bankCreateFieldsMap: Record<keyof BankCreateFields, FieldConfig> = {
  inflowOrOutflow: { label: '流入/流出', type: 'number' }, // 1=流入, 2=流出，用于统一标识资金流向
  bankBillType: { label: '银行账单类型', type: 'number' }, // 系统定义的银行账单分类
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