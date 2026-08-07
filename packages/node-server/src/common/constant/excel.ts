import { formatUTCToLocalString, nowDateFun } from '../date';
import { safeString } from '../string';

// 处理导入字符串
const formatExcelStr = (str: any): string => {
  if (typeof str !== 'string') {
    return str ? String(str) : '';
  }
  return str.replace(/\n/g, '').replace(/[ ]/g, '');
};

// 处理导入数字
const formatExcelNum = (val: any): number => {
  return isNaN(Number(val)) ? 0 : Number(val);
};

const formatExcelFormula = (val: any): any => {
  if (typeof val === 'object' && val.formula && val.result) {
    return val.result;
  }
  return val;
};

// 微信账单key值重命名
export const weChatExcelCellHandle = (fileType: 'csv' | 'xlsx') => ({
  1: (tar: any, val: any) => {
    if (fileType === 'xlsx') {
      tar['tradeTime'] = formatUTCToLocalString(val);
    } else {
      tar['tradeTime'] = nowDateFun(val);
    }
  }, // 交易时间
  2: (tar: any, val: any) => {
    tar['tradeType'] = formatExcelStr(val);
  }, // 交易类型
  3: (tar: any, val: any) => {
    tar['tradeOtherPerson'] = formatExcelStr(val);
  }, // 交易对方
  4: (tar: any, val: any) => {
    tar['goods'] = formatExcelStr(val);
  }, // 商品
  5: (tar: any, val: any) => {
    tar['incomeOrPay'] = formatExcelStr(val);
  }, // 收/支
  6: (tar: any, val: any) => {
    const money = safeString(val).replace(/[¥￥,]/g, '');
    tar['moneyAmount'] = formatExcelNum(money);
  }, // 金额(元)
  7: (tar: any, val: any) => {
    tar['paymentMethod'] = formatExcelStr(val);
  }, // 支付方式
  8: (tar: any, val: any) => {
    tar['currentStatus'] = formatExcelStr(val);
  }, // 当前状态
  11: (tar: any, val: any) => {
    tar['remarks'] = formatExcelStr(val);
  }, // 备注
});

// 支付宝账单key值重命名
export const aliPayExcelCellHandle = {
  // 交易时间
  1: (tar: any, val: any) => {
    tar['tradeTime'] = nowDateFun(val);
  },
  // 交易分类
  2: (tar: any, val: any) => {
    tar['tradeType'] = formatExcelStr(val);
  },
  // 交易对方
  3: (tar: any, val: any) => {
    tar['tradeOtherPerson'] = formatExcelStr(val);
  },
  // 对方账号
  4: (tar: any, val: any) => {
    tar['oppositeAccount'] = formatExcelStr(val);
  },
  // 商品说明
  5: (tar: any, val: any) => {
    tar['productDescription'] = formatExcelStr(val);
  },
  // 收/支
  6: (tar: any, val: any) => {
    tar['incomeOrPay'] = formatExcelStr(val);
  },
  // 金额
  7: (tar: any, val: any) => {
    const money = val;
    tar['moneyAmount'] = formatExcelNum(money);
  },
  // 收/付款方式
  8: (tar: any, val: any) => {
    tar['paymentMethod'] = formatExcelStr(val);
  },
  // 交易状态
  9: (tar: any, val: any) => {
    tar['tradeStatus'] = formatExcelStr(val);
  },
};

// 银行账单所属类型
export const bankExcelCellMap = {
  1: {
    sheetName: '中国工商银行',
    excelCellHandle: {
      1: (tar: any, val: any) => {
        tar['voucherNo'] = formatExcelStr(val);
        tar['voucherType'] = 2; // 1 存折，2 储蓄卡，3 信用卡
      }, // 卡号
      2: (tar: any, val: any) => {
        let tradeTime = formatExcelFormula(val);
        tar['tradeTime'] = nowDateFun(tradeTime);
      }, // 交易日期
      8: (tar: any, val: any) => {
        tar['explain'] = formatExcelStr(val);
      }, // 摘要
      10: (tar: any, val: any) => {
        if (typeof val !== 'number') {
          tar['incomeOrPay'] = '';
          tar['moneyAmount'] = val;
          return;
        }
        if (val < 0) tar['incomeOrPay'] = '支出';
        else tar['incomeOrPay'] = '收入';
        tar['moneyAmount'] = Math.abs(val);
      }, // 收入/支出金额
      11: (tar: any, val: any) => {
        tar['balance'] = formatExcelNum(val);
      }, // 余额
      12: (tar: any, val: any) => {
        tar['tradeOtherPerson'] = formatExcelStr(formatExcelFormula(val));
      }, // 对方户名
      13: (tar: any, val: any) => {
        tar['tradeOtherPersonAccount'] = formatExcelStr(formatExcelFormula(val));
      }, // 对方账号
      14: (tar: any, val: any) => {
        tar['tradeType'] = formatExcelStr(formatExcelFormula(val));
      }, // 渠道
    },
  },
  2: {
    sheetName: '中国农业银行',
    excelCellHandle: {
      1: (tar: any, val: any) => {
        tar['voucherNo'] = formatExcelStr(val);
        tar['voucherType'] = 2; // 1 存折，2 储蓄卡，3 信用卡
      }, // 账号
      2: (tar: any, val: any) => {
        tar['tradeTime'] = nowDateFun(formatExcelFormula(val));
      }, // 交易时间
      3: (tar: any, val: any) => {
        tar['explain'] = formatExcelStr(val);
      }, // 摘要
      4: (tar: any, val: any) => {
        if (typeof val !== 'number') {
          tar['incomeOrPay'] = '';
          tar['moneyAmount'] = val;
          return;
        }
        if (val < 0) tar['incomeOrPay'] = '支出';
        else tar['incomeOrPay'] = '收入';
        tar['moneyAmount'] = Math.abs(val);
      }, // 收入/支出金额
      5: (tar: any, val: any) => {
        tar['balance'] = formatExcelNum(val);
      }, // 余额
      6: (tar: any, val: any) => {
        tar['tradeOtherPerson'] = formatExcelStr(formatExcelFormula(val));
      }, // 对⼿信息
      7: (tar: any, val: any) => {
        tar['tradeType'] = formatExcelStr(val);
      }, // 渠道
    },
  },
  3: {
    sheetName: '中国建设银行',
    excelCellHandle: {
      1: (tar: any, val: any) => {
        tar['voucherNo'] = formatExcelStr(val);
        tar['voucherType'] = 2; // 1 存折，2 储蓄卡，3 信用卡
      }, // 卡号/账号
      2: (tar: any, val: any) => {
        tar['explain'] = formatExcelStr(val);
      }, // 摘要
      5: (tar: any, val: any) => {
        tar['tradeTime'] = nowDateFun(formatExcelFormula(val));
      }, // 交易日期
      6: (tar: any, val: any) => {
        if (typeof val !== 'number') {
          tar['incomeOrPay'] = '';
          tar['moneyAmount'] = val;
          return;
        }
        if (val < 0) tar['incomeOrPay'] = '支出';
        else tar['incomeOrPay'] = '收入';
        tar['moneyAmount'] = Math.abs(val);
      }, // 交易金额
      7: (tar: any, val: any) => {
        tar['balance'] = formatExcelNum(formatExcelFormula(val));
      }, // 账户余额
      8: (tar: any, val: any) => {
        tar['place'] = formatExcelStr(val);
      }, // 交易地点
      9: (tar: any, val: any) => {
        tar['tradeType'] = formatExcelStr(val);
      }, // 附言
      10: (tar: any, val: any) => {
        tar['tradeOtherPersonAccount'] = formatExcelStr(formatExcelFormula(val));
      }, // 对方账号
      11: (tar: any, val: any) => {
        tar['tradeOtherPerson'] = formatExcelStr(val);
      }, // 户名
    },
  },
  4: {
    sheetName: '民生银行',
    excelCellHandle: {
      1: (tar: any, val: any) => {
        tar['voucherType'] = val === '卡' ? 2 : 1; // 1 存折，2 储蓄卡，3 信用卡
      }, // 凭证类型
      2: (tar: any, val: any) => {
        tar['voucherNo'] = formatExcelStr(val);
      }, // 凭证号码
      3: (tar: any, val: any) => {
        tar['tradeTime'] = nowDateFun(formatExcelFormula(val));
      }, // 交易时间
      4: (tar: any, val: any) => {
        tar['explain'] = formatExcelStr(val);
      }, // 摘要
      5: (tar: any, val: any) => {
        if (typeof val !== 'number') {
          tar['incomeOrPay'] = '';
          tar['moneyAmount'] = val;
          return;
        }
        if (val < 0) tar['incomeOrPay'] = '支出';
        else tar['incomeOrPay'] = '收入';
        tar['moneyAmount'] = Math.abs(val);
      }, // 交易金额
      6: (tar: any, val: any) => {
        tar['balance'] = formatExcelNum(formatExcelFormula(val));
      }, // 账户余额
      8: (tar: any, val: any) => {
        tar['tradeType'] = formatExcelStr(val);
      }, // 交易渠道
      10: (tar: any, val: any) => {
        tar['tradeOtherPerson'] = formatExcelStr(formatExcelFormula(val));
      }, // 对方户名/账号
      11: (tar: any, val: any) => {
        tar['tradeOtherPersonRemarks'] = formatExcelStr(val);
      }, // 对方行名
    },
  },
  5: {
    sheetName: '招商银行',
    excelCellHandle: {
      1: (tar: any, val: any) => {
        tar['voucherNo'] = formatExcelStr(val);
        tar['voucherType'] = 2; // 1 存折，2 储蓄卡，3 信用卡
      }, // 交易时间
      2: (tar: any, val: any) => {
        tar['tradeTime'] = nowDateFun(formatExcelFormula(val));
      }, // 交易时间
      3: (tar: any, val: any) => {
        if (typeof val !== 'number') {
          tar['incomeOrPay'] = '';
          tar['moneyAmount'] = val;
          return;
        }
        if (val < 0) tar['incomeOrPay'] = '支出';
        else tar['incomeOrPay'] = '收入';
        tar['moneyAmount'] = Math.abs(val);
      }, // 交易金额
      4: (tar: any, val: any) => {
        tar['balance'] = formatExcelNum(formatExcelFormula(val));
      }, // 余额
      5: (tar: any, val: any) => {
        tar['tradeType'] = formatExcelStr(val);
      }, // 交易说明
      6: (tar: any, val: any) => {
        tar['tradeOtherPerson'] = formatExcelStr(val);
      }, // 交易对方
    },
  },
};
