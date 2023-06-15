import { nowDateFun } from '../date';
import { filterStr } from '../string';

// 微信账单key值重命名
export const weChatExcelCellHandle = {
  1: (tar: any, val: any) => {
    tar['tradeTime'] = nowDateFun(val);
  }, // 交易时间
  2: (tar: any, val: any) => {
    tar['tradeType'] = val || '';
  }, // 交易类型
  3: (tar: any, val: any) => {
    tar['tradeOtherPerson'] = filterStr(val);
  }, // 交易对方
  4: (tar: any, val: any) => {
    tar['goods'] = val || '';
  }, // 商品
  5: (tar: any, val: any) => {
    tar['incomeOrPay'] = val || '';
  }, // 收入
  6: (tar: any, val: any) => {
    const money = val.replace(/[¥￥]/, '');
    tar['moneyAmount'] = isNaN(Number(money)) ? 0 : Number(money);
  }, // 金额(元)
  7: (tar: any, val: any) => {
    tar['paymentMethod'] = val || '';
  }, // 支付方式
  8: (tar: any, val: any) => {
    tar['currentStatus'] = val || '';
  }, // 当前状态
  11: (tar: any, val: any) => {
    tar['remarks'] = val || '';
  }, // 备注
};

// 支付宝账单key值重命名
export const aliPayExcelCellHandle = {
  1: (tar: any, val: any) => {
    tar['incomeOrPay'] = val || '';
  }, // 收/支
  2: (tar: any, val: any) => {
    tar['tradeOtherPerson'] = filterStr(val);
  }, // 交易对方
  3: (tar: any, val: any) => {
    tar['oppositeAccount'] = val || '';
  }, // 对方账号
  4: (tar: any, val: any) => {
    tar['productDescription'] = val || '';
  }, // 商品说明
  5: (tar: any, val: any) => {
    tar['paymentMethod'] = val || '';
  }, // 收/付款方式
  6: (tar: any, val: any) => {
    const money = val;
    tar['moneyAmount'] = isNaN(Number(money)) ? 0 : Number(money);
  }, // 金额
  7: (tar: any, val: any) => {
    tar['tradeStatus'] = val || '';
  }, // 交易分类
  8: (tar: any, val: any) => {
    tar['tradeType'] = val || '';
  }, // 交易分类
  11: (tar: any, val: any) => {
    tar['tradeTime'] = nowDateFun(val);
  }, // 交易时间
};

// 银行账单所属类型
export const bankExcelCellMap = {
  1: {
    sheetName: '中国工商银行',
    excelCellHandle: {
      1: (tar: any, val: any) => {
        tar['voucherNo'] = val;
        tar['voucherType'] = 2; // 1 存折，2 储蓄卡，3 信用卡
      }, // 卡号
      2: (tar: any, val: any) => {
        tar['tradeTime'] = nowDateFun(val);
      }, // 交易日期
      8: (tar: any, val: any) => {
        tar['explain'] = val;
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
        tar['balance'] = val;
      }, // 余额
      12: (tar: any, val: any) => {
        tar['tradeOtherPerson'] = filterStr(val);
      }, // 对方户名
      13: (tar: any, val: any) => {
        tar['tradeOtherPersonAccount'] = filterStr(val);
      }, // 对方账号
      14: (tar: any, val: any) => {
        tar['tradeType'] = val;
      }, // 渠道
    },
  },
  2: {
    sheetName: '中国农业银行',
    excelCellHandle: {
      1: (tar: any, val: any) => {
        tar['voucherNo'] = val;
        tar['voucherType'] = 2; // 1 存折，2 储蓄卡，3 信用卡
      }, // 账号
      2: (tar: any, val: any) => {
        tar['tradeTime'] = nowDateFun(val);
      }, // 交易时间
      3: (tar: any, val: any) => {
        tar['explain'] = val;
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
        tar['balance'] = val;
      }, // 余额
      6: (tar: any, val: any) => {
        tar['tradeOtherPerson'] = filterStr(val);
      }, // 对⼿信息
      7: (tar: any, val: any) => {
        tar['tradeType'] = val;
      }, // 渠道
    },
  },
  3: {
    sheetName: '中国建设银行',
    excelCellHandle: {
      1: (tar: any, val: any) => {
        tar['voucherNo'] = val;
        tar['voucherType'] = 2; // 1 存折，2 储蓄卡，3 信用卡
      }, // 卡号/账号
      2: (tar: any, val: any) => {
        tar['explain'] = val;
      }, // 摘要
      5: (tar: any, val: any) => {
        tar['tradeTime'] = nowDateFun(val);
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
        tar['balance'] = val;
      }, // 账户余额
      8: (tar: any, val: any) => {
        tar['place'] = val;
      }, // 交易地点
      9: (tar: any, val: any) => {
        tar['tradeType'] = val;
      }, // 附言
      10: (tar: any, val: any) => {
        tar['tradeOtherPersonAccount'] = filterStr(val);
      }, // 对方账号
      11: (tar: any, val: any) => {
        tar['tradeOtherPerson'] = filterStr(val);
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
        tar['voucherNo'] = val;
      }, // 凭证号码
      3: (tar: any, val: any) => {
        tar['tradeTime'] = nowDateFun(val);
      }, // 交易时间
      4: (tar: any, val: any) => {
        tar['explain'] = val;
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
        tar['balance'] = val;
      }, // 账户余额
      8: (tar: any, val: any) => {
        tar['tradeType'] = val;
      }, // 交易渠道
      10: (tar: any, val: any) => {
        tar['tradeOtherPerson'] = filterStr(val);
      }, // 对方户名/账号
      11: (tar: any, val: any) => {
        tar['tradeOtherPersonRemarks'] = val;
      }, // 对方行名
    },
  },
  5: {
    sheetName: '招商银行',
    excelCellHandle: {
      1: (tar: any, val: any) => {
        tar['voucherNo'] = val;
        tar['voucherType'] = 2; // 1 存折，2 储蓄卡，3 信用卡
      }, // 交易时间
      2: (tar: any, val: any) => {
        tar['tradeTime'] = nowDateFun(val);
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
        tar['balance'] = val;
      }, // 余额
      5: (tar: any, val: any) => {
        tar['tradeType'] = val;
      }, // 交易说明
      6: (tar: any, val: any) => {
        tar['tradeOtherPerson'] = filterStr(val);
      }, // 交易对方
    },
  },
};
