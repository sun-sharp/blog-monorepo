import { ApiWeChatUpload, WeChatBaseFields, WeChatCreateFields } from "/#/api/blog/money/we-chat";

interface FieldConfig {
  label: string;
  type: 'string' | 'number' | 'date';
}

export const weChatBaseFieldsMap: Record<keyof WeChatBaseFields, FieldConfig> = {
  tradeTime: { label: '交易时间', type: 'string' },
  tradeType: { label: '交易类型', type: 'string' },
  tradeOtherPerson: { label: '交易对方', type: 'string' },
  tradeOtherPersonRemarks: { label: '交易对方备注', type: 'string' },
  goods: { label: '商品', type: 'string' },
  incomeOrPay: { label: '收/支', type: 'string' },
  moneyAmount: { label: '金额(元)', type: 'number' },
  otherCost: { label: '其它费用', type: 'number' },
  paymentMethod: { label: '支付方式', type: 'string' },
  currentStatus: { label: '当前状态', type: 'string' },
  remarks: { label: '备注', type: 'string' },
  explain: { label: '账单说明', type: 'string' },
  place: { label: '使用地点', type: 'string' },
};

export const weChatCreateFieldsMap: Record<keyof WeChatCreateFields, FieldConfig> = {
  inflowOrOutflow: { label: '流入/流出', type: 'number' },
  billType: { label: '账单类型', type: 'number' },
  billMethod: { label: '账单方式', type: 'number' },
  balance: { label: '余额', type: 'number' },
};

// ============ 3. 最终导入字段映射（基于 ApiWeChatUpload） ============
type ApiWeChatUploadKeys = keyof ApiWeChatUpload; // 自动推导为联合类型

// 对象的键必须恰好是 ApiWeChatUpload 的所有字段
export const weChatUploadFieldsMap: Record<keyof ApiWeChatUpload, FieldConfig> = {
  // 从 weChatBaseFieldsMap 选取的字段
  tradeTime: weChatBaseFieldsMap.tradeTime,
  tradeType: weChatBaseFieldsMap.tradeType,
  tradeOtherPerson: weChatBaseFieldsMap.tradeOtherPerson,
  goods: weChatBaseFieldsMap.goods,
  incomeOrPay: weChatBaseFieldsMap.incomeOrPay,
  moneyAmount: weChatBaseFieldsMap.moneyAmount,
  paymentMethod: weChatBaseFieldsMap.paymentMethod,
  currentStatus: weChatBaseFieldsMap.currentStatus,
  remarks: weChatBaseFieldsMap.remarks,
  // 从 weChatCreateFieldsMap 选取的字段
  billMethod: weChatCreateFieldsMap.billMethod,
  inflowOrOutflow: weChatCreateFieldsMap.inflowOrOutflow,
  billType: weChatCreateFieldsMap.billType,
};

// 如果需要数组形式，可通过 Object.values 转换
export const weChatUploadFields = Object.entries(weChatUploadFieldsMap).map(([key, meta]) => ({
  key: key as keyof ApiWeChatUpload, // 类型断言，确保键合法
  label: meta.label,
  type: meta.type,
}));;