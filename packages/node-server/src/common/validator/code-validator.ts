import { runCode } from 'src/common/string';

/**
 * @description: 账单导入代码（bill-upload）字段白名单规则
 * 微信账单(1)：微信账单导入字段
 * 支付宝账单(2)：支付宝账单导入字段
 * 银行账单(3)：银行账单导入字段
 */
export const codeFieldWhitelist: Record<number, string[]> = {
  // 微信账单可引用的 item 字段
  1: [
    'tradeTime',
    'tradeType',
    'tradeOtherPerson',
    'goods',
    'incomeOrPay',
    'moneyAmount',
    'paymentMethod',
    'currentStatus',
    'remarks',
    'billMethod',
    'inflowOrOutflow',
    'billType',
  ],
  // 支付宝账单可引用的 item 字段
  2: [
    'tradeTime',
    'tradeType',
    'tradeOtherPerson',
    'oppositeAccount',
    'productDescription',
    'incomeOrPay',
    'moneyAmount',
    'paymentMethod',
    'billMethod',
    'inflowOrOutflow',
    'billType',
    'tradeStatus',
  ],
  // 银行账单可引用的 item 字段
  3: [
    'tradeTime',
    'tradeType',
    'bankType',
    'voucherType',
    'voucherNo',
    'tradeOtherPerson',
    'tradeOtherPersonAccount',
    'tradeOtherPersonRemarks',
    'incomeOrPay',
    'moneyAmount',
    'balance',
    'otherCost',
    'explain',
    'place',
    'inflowOrOutflow',
    'bankBillType',
  ],
};

/**
 * @description: 校验账单导入 code 的参考字段是否在对应账单类型允许的范围内
 * @param {number} billUploadType 账单导入类型
 * @param {string} code 代码
 * @return {string} 返回错误信息，为空表示通过
 */
export const validBillUploadCode = (billUploadType: number, code: string): string => {
  const allowFields = codeFieldWhitelist[billUploadType] || [];
  // 提取 code 中所有 item.xxx 属性名并去重
  const itemProps = [...new Set([...code.matchAll(/item\.(\w+)/g)].map((m) => m[1]))];
  const invalidProps = itemProps.filter((prop) => !allowFields.includes(prop));
  if (invalidProps.length > 0) {
    return `代码引用了不存在的账单字段：${invalidProps.join(', ')}`;
  }
  return '';
};

/**
 * @description: 校验账单导入 code 能否被正确执行（语法/运行时校验）
 * 用一条示例数据跑一遍，确保代码可运行且返回的 isAssignment 为 boolean
 * @param {string} code 代码
 * @param {Record<string, any>} item 示例账单数据
 * @return {boolean} 是否校验通过
 */
export const validBillUploadCodeExecut = (code: string, item: Record<string, any>): boolean => {
  try {
    const result = runCode(code, { item, isAssignment: false });
    return typeof result?.isAssignment === 'boolean';
  } catch {
    return false;
  }
};
